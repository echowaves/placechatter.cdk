import * as cdk from '@aws-cdk/core'
import * as s3 from '@aws-cdk/aws-s3'
import * as s3n from '@aws-cdk/aws-s3-notifications'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as lambda from '@aws-cdk/aws-lambda'
import * as cloudfront from '@aws-cdk/aws-cloudfront'
import * as origins from '@aws-cdk/aws-cloudfront-origins'
import * as acm from '@aws-cdk/aws-certificatemanager'
import * as route53 from '@aws-cdk/aws-route53'
import * as logs from '@aws-cdk/aws-logs'

import { LambdaFunction } from '@aws-cdk/aws-events-targets'
import { Rule, Schedule } from '@aws-cdk/aws-events'
import * as rds from '@aws-cdk/aws-rds'
import * as appsync from '@aws-cdk/aws-appsync'
import * as iam from '@aws-cdk/aws-iam'

import * as cognito from '@aws-cdk/aws-cognito'

// import {ISecret, Secret,} from "@aws-cdk/aws-secretsmanager"
// import * as path from 'path'

// const hostedZone =  route53.HostedZone

var path = require('path')

export function deployEnv() {
  return process.env.DEPLOY_ENV || 'test'
}

const config = require(`../.env.${deployEnv()}`).config()

// function envSpecific(logicalName: string | Function) {
//   const suffix =
//     typeof logicalName === "function"
//       ? logicalName.name
//       : logicalName

//   return `${deployEnv()}-${suffix}`
// }

export class PlaceChatterCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // The code that defines your stack goes here

    // will refer to already created DB instance instead of creating new one.
    const database = rds.DatabaseInstance.fromDatabaseInstanceAttributes(
      this,
      `placechatter-${deployEnv()}`,
      {
        instanceIdentifier: `placechatter-${deployEnv()}`,
        instanceEndpointAddress: `placechatter-${deployEnv()}.cbaw0b5dcxjh.us-east-1.rds.amazonaws.com`,
        port: 5432,
        securityGroups: [],
      },
    )

    database.connections.allowFromAnyIpv4(ec2.Port.tcp(parseInt(config.port)))
    database.connections.allowDefaultPortInternally()

    // Create the AppSync API
    const api = new appsync.GraphqlApi(
      this,
      `${deployEnv()}-PlaceChatter-appsyncApi-cdk`,
      {
        name: `${deployEnv()}-cdk-placechatter-appsync-api`,
        schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
        authorizationConfig: {
          defaultAuthorization: {
            authorizationType: appsync.AuthorizationType.API_KEY,
            apiKeyConfig: {
              expires: cdk.Expiration.after(cdk.Duration.days(365)),
            },
          },
        },
        xrayEnabled: true,
      },
    )

    const layerArn =
      'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:14'
    const insightsVersion =
      lambda.LambdaInsightsVersion.fromInsightVersionArn(layerArn)
    const logRetention = logs.RetentionDays.TWO_WEEKS

    // Create the Lambda function that will map GraphQL operations into Postgres
    const placechatterFn = new lambda.Function(
      this,
      `${deployEnv()}-PlaceChatter-GraphQlMapFunction-cdk`,
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        code: lambda.Code.fromAsset('lambda-fns/lambdas.zip'),
        insightsVersion,
        logRetention,
        // code: new lambda.AssetCode('lambda-fns'),
        handler: 'index.handler',
        // memorySize: 10240,
        memorySize: 3008,
        timeout: cdk.Duration.seconds(30),
        environment: {
          ...config,
        },
      },
    )

    // create a layer
    // const ffmpegLayer = lambda.LayerVersion.fromLayerVersionArn(this, 'ffmpegLayer',
    //   'arn:aws:lambda:us-east-1:963958500685:layer:ffmpeg:1'
    // )

    // define lambda for thumbnails processing
    const processUploadedImageLambdaFunction = new lambda.Function(
      this,
      `${deployEnv()}_processUploadedImage`,
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        code: lambda.Code.fromAsset('lambda-fns/lambdas.zip'),
        insightsVersion,
        logRetention,
        // code: lambda.Code.fromAsset(path.join(__dirname, '/../lambda-fns/controllers/photos')),
        handler: 'lambdas/processUploadedImage.main',
        memorySize: 3008,
        timeout: cdk.Duration.seconds(300),
        // layers: [ffmpegLayer],
        environment: {
          ...config,
        },
      },
    )

    // define lambda for thumbnails deletion processing
    const processDeletedImageLambdaFunction = new lambda.Function(
      this,
      `${deployEnv()}_processDeletedImage`,
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        code: lambda.Code.fromAsset('lambda-fns/lambdas.zip'),
        insightsVersion,
        logRetention,
        // code: lambda.Code.fromAsset(path.join(__dirname, '/../lambda-fns/controllers/photos')),
        handler: 'lambdas/processDeletedImage.main',
        memorySize: 3008,
        timeout: cdk.Duration.seconds(300),
        environment: {
          ...config,
        },
      },
    )

    if (deployEnv() === 'prod') {
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // imgBucket
    // Grant access to s3 bucket for lambda function
    const imgBucket = s3.Bucket.fromBucketName(
      this,
      `placechatter-img-${deployEnv()}`,
      `placechatter-img-${deployEnv()}`,
    )
    imgBucket.grantPut(placechatterFn)
    imgBucket.grantPutAcl(placechatterFn)
    imgBucket.grantDelete(placechatterFn)

    imgBucket.grantPut(processUploadedImageLambdaFunction)
    imgBucket.grantPutAcl(processUploadedImageLambdaFunction)
    imgBucket.grantDelete(processUploadedImageLambdaFunction)

    imgBucket.grantDelete(processDeletedImageLambdaFunction)

    // processUploadedImageLambdaFunction.addToRolePolicy(new iam.PolicyStatement({
    //   effect: iam.Effect.ALLOW,
    //   // permission policy to allow label detection from rekognition across all resources
    //   // actions: [
    //   // ],
    //   resources: ['*',],
    // }))

    // expiration can't be configured on the exiting bucket programmatically -- has to be done in the admin UI
    // imgBucket.addLifecycleRule({
    //      expiration: cdk.Duration.days(90),
    //    })

    // invoke lambda every time an object is created in the bucket
    imgBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(processUploadedImageLambdaFunction),
      // only invoke lambda if object matches the filter
      // {prefix: 'test/', suffix: '.yaml'},
      { suffix: '.upload' },
    )

    // invoke lambda every time an object is deleted in the bucket
    imgBucket.addEventNotification(
      s3.EventType.OBJECT_REMOVED,
      new s3n.LambdaDestination(processDeletedImageLambdaFunction),
      // only invoke lambda if object matches the filter
      // {prefix: 'test/', suffix: '.yaml'},
      { suffix: '-thumb.webp' },
    )

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Grant access to the database from the Lambda function
    database.grantConnect(placechatterFn)
    // Set the new Lambda function as a data source for the AppSync API
    const lambdaDs = api.addLambdaDataSource(`lambdaDatasource`, placechatterFn)

    // Map the resolvers to the Lambda function

    // ******************************************************
    //                       queries
    // ******************************************************
    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'nickNameTypeAhead',
    })
    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'placeRead',
    })
    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'placeCardRead',
    })
    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'placesFeed',
    })
    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'isValidToken',
    })
    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'isPlaceOwner',
    })

    // ******************************************************
    //                       mutations
    // ******************************************************
    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'activationCodeGenerate',
    })
    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'phoneActivate',
    })
    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'placeCreate',
    })
    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'placeCardCreate',
    })
    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'placeCardSave',
    })
    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'generateUploadUrlForCard',
    })
    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'placeCardPhotoDelete',
    })
    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'placeCardDelete',
    })
    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'placeDelete',
    })

    // CFN Outputs
    new cdk.CfnOutput(this, 'AppSyncAPIURL', {
      value: api.graphqlUrl,
    })
    new cdk.CfnOutput(this, 'AppSyncAPIKey', {
      value: api.apiKey || '',
    })
    new cdk.CfnOutput(this, 'ProjectRegion', {
      value: this.region,
    })
  }
}
