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
    def ddb_create(x):

        x['id'] = str(uuid.uuid1())
        x['start_time'] = str(datetime.now())
        response = {
            "result": "",
            "statusCode": 400
        }

        try:
            response = dynamo.put_item(Item=x)
            response['result'] = "Successfully added the question."
            response['statusCode'] = 201

        except Exception as e:
            response['result'] = "Failed to save question. " + str(e)
            response['statusCode'] = 400

        return response

    response = ddb_create(event)

    return response
