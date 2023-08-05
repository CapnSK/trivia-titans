import json
import uuid
import boto3
from datetime import datetime

# define the DynamoDB table that Lambda will connect to
tableName = "triviaquestions"

# create the DynamoDB resource
dynamo = boto3.resource('dynamodb').Table(tableName)


def lambda_handler(event, context):
    # define the functions used to perform the CRUD operations
    def ddb_read(x):

        response_json = {
            "result": "",
            "statusCode": 400
        }

        try:
            response = dynamo.scan()
            response_json['result'] = "All the questions fetched Successfully."
            response_json['statusCode'] = 200
            response_json['data'] = response['Items']

        except Exception as e:
            response_json['result'] = "Failed to fetch questions. " + str(e)
            response_json['statusCode'] = 400

        return response_json

    response = ddb_read(event)

    return response
