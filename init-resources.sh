echo ">>> script starting process..."

echo "creating SNS..."
# create sns topic
aws --endpoint-url=http://localhost:4566 sns create-topic --name siproad-admin-sns
aws --endpoint-url=http://localhost:4566 sns create-topic --name siproad-products-sns

# create sqs queue
echo "creating SQS..."
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name siproad-admin-products-sqs
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name siproad-admin-orders-sqs
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name siproad-products-orders-sqs

# subscribe sqs to sns

  # permissions sns - sqs
aws --endpoint-url=http://localhost:4566 sqs set-queue-attributes \
--queue-url http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/siproad-admin-products-sqs \
--attributes '{
  "Policy": "{\"Version\": \"2012-10-17\", \"Statement\": [{\"Effect\": \"Allow\", \"Principal\": \"*\", \"Action\": \"SQS:SendMessage\", \"Resource\": \"arn:aws:sqs:us-east-1:000000000000:siproad-admin-products-sqs\", \"Condition\": {\"ArnEquals\": {\"aws:SourceArn\": \"arn:aws:sns:us-east-1:000000000000:siproad-admin-sns\"}}}]}"
}'

aws --endpoint-url=http://localhost:4566 sqs set-queue-attributes \
--queue-url http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/siproad-admin-orders-sqs \
--attributes '{
  "Policy": "{\"Version\": \"2012-10-17\", \"Statement\": [{\"Effect\": \"Allow\", \"Principal\": \"*\", \"Action\": \"SQS:SendMessage\", \"Resource\": \"arn:aws:sqs:us-east-1:000000000000:siproad-admin-orders-sqs\", \"Condition\": {\"ArnEquals\": {\"aws:SourceArn\": \"arn:aws:sns:us-east-1:000000000000:siproad-admin-sns\"}}}]}"
}'

aws --endpoint-url=http://localhost:4566 sqs set-queue-attributes \
--queue-url http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/siproad-products-orders-sqs \
--attributes '{
  "Policy": "{\"Version\": \"2012-10-17\", \"Statement\": [{\"Effect\": \"Allow\", \"Principal\": \"*\", \"Action\": \"SQS:SendMessage\", \"Resource\": \"arn:aws:sqs:us-east-1:000000000000:siproad-products-orders-sqs\", \"Condition\": {\"ArnEquals\": {\"aws:SourceArn\": \"arn:aws:sns:us-east-1:000000000000:siproad-products-sns\"}}}]}"
}'

  # subscribe sqs to sns
echo "creating subscriptions SQS to SNS..."
aws --endpoint-url=http://localhost:4566 sns subscribe \
--topic-arn arn:aws:sns:us-east-1:000000000000:siproad-admin-sns \
--protocol sqs \
--notification-endpoint arn:aws:sqs:us-east-1:000000000000:siproad-admin-products-sqs

aws --endpoint-url=http://localhost:4566 sns subscribe \
--topic-arn arn:aws:sns:us-east-1:000000000000:siproad-admin-sns \
--protocol sqs \
--notification-endpoint arn:aws:sqs:us-east-1:000000000000:siproad-admin-orders-sqs

aws --endpoint-url=http://localhost:4566 sns subscribe \
--topic-arn arn:aws:sns:us-east-1:000000000000:siproad-products-sns \
--protocol sqs \
--notification-endpoint arn:aws:sqs:us-east-1:000000000000:siproad-products-orders-sqs

echo "creating lambda..."
LAMBDA_NAME="siproad-products-lambda"
LAMBDA_RUNTIME="nodejs18.x"
LAMBDA_HANDLER="dist/main.handler"
LAMBDA_ROLE="arn:aws:iam::000000000000:role/lambda-role"  # Puede ser cualquier valor simulado
LAMBDA_ZIP_PATH="/etc/localstack/siproad-products-lambda.zip"

# Verifica si el archivo ZIP existe antes de crear el Lambda
if [ -f "$LAMBDA_ZIP_PATH" ]; then
  
  awslocal lambda create-function \
    --function-name "$LAMBDA_NAME" \
    --runtime "$LAMBDA_RUNTIME" \
    --role "$LAMBDA_ROLE" \
    --handler "$LAMBDA_HANDLER" \
    --zip-file fileb://"$LAMBDA_ZIP_PATH" \
    --timeout 45

  echo "lambda '$LAMBDA_NAME' created OK"

else
  echo "Error: ZIP file not found, path='$LAMBDA_ZIP_PATH'."
fi

echo "creating subscriptions lambda to SQS..."
aws --endpoint-url=http://localhost:4566 lambda create-event-source-mapping \
  --function-name "$LAMBDA_NAME" \
  --event-source arn:aws:sqs:us-east-1:000000000000:siproad-admin-products-sqs \
  --batch-size 10 \
  --function-response-types ReportBatchItemFailures

echo "<<< script executed"
