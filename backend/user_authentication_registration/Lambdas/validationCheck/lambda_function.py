# This lambda function is used to check the validity of the user's access token

import json
import boto3
import os
import logging
import requests

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    pass