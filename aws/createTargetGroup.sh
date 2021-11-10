aws elbv2 create-target-group --region ap-southeast-1 --protocol HTTP --port 80 --vpc-id vpc-012b2be66e9914de3 --healthy-threshold-count 2 --unhealthy-threshold-count 3 --health-check-timeout-seconds 5 --health-check-interval-seconds 20 --health-check-path /api/comm --name comm

aws elbv2 create-target-group --region ap-southeast-1 --protocol HTTP --port 80 --vpc-id vpc-012b2be66e9914de3 --healthy-threshold-count 2 --unhealthy-threshold-count 3 --health-check-timeout-seconds 5 --health-check-interval-seconds 20 --health-check-path /api/user --name user

aws elbv2 create-target-group --region ap-southeast-1 --protocol HTTP --port 80 --vpc-id vpc-012b2be66e9914de3 --healthy-threshold-count 2 --unhealthy-threshold-count 3 --health-check-timeout-seconds 5 --health-check-interval-seconds 20 --health-check-path /api/question --name question 

aws elbv2 create-target-group --region ap-southeast-1 --protocol HTTP --port 80 --vpc-id vpc-012b2be66e9914de3 --healthy-threshold-count 2 --unhealthy-threshold-count 3 --health-check-timeout-seconds 5 --health-check-interval-seconds 20 --health-check-path /api/collab --name collab