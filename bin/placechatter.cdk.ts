#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { PlaceChatterCdkStack, deployEnv } from '../lib/placechatter.cdk-stack';

const app = new cdk.App();
new PlaceChatterCdkStack(app, deployEnv() + "-PlaceChatterCdkStack",  {
    env: {
        region: 'us-east-1'
    }
})
