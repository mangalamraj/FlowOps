# from kafka import KafkaConsumer 
# import json

# consumer = KafkaConsumer(
#     'rule-topic',
#     bootstrap_servers ="localhost:9092",
#     auto_offset_reset="earliest",   # read from beginning if no offset
#     enable_auto_commit=True,
#     group_id="rules-consumer-group",
#     value_deserializer=lambda m: json.loads(m.decode("utf-8")),
# )

# def consume_message(process_rules_background, tags, sku, orderid, background_tasks):
#     print("Kafka consumer started!")
#     try:
#         for message in consumer:
#             background_tasks.add_task(
#                 process_rules_background,
#                 message.tags,
#                 message.sku,
#                 message.orderid
#             )
