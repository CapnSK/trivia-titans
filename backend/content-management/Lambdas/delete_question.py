import json
import uuid
import boto3
from datetime import datetime

# define the DynamoDB table that Lambda will connect to
tableName = "triviaquestions"

# create the DynamoDB resource
dynamo = boto3.resource('dynamodb').Table(tableName)


def lambda_handler(event, context):
    def ddb_delete(x):

        response_json = {
            "result": "",
            "statusCode": 400
        }

        try:
            response = dynamo.delete_item(Key=x)
            response_json['result'] = "Successfully deleted the question."
            response_json['statusCode'] = 200
            print(f"Response object is: {response}")

        except Exception as e:
            response_json['result'] = "Failed to delete the question. " + str(e)
            response_json['statusCode'] = 400

        return response_json

    response = ddb_delete(event)

    return response
