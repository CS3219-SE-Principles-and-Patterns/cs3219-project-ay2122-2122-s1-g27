echo "Logging into AWS CLI"
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 518307714220.dkr.ecr.ap-southeast-1.amazonaws.com

echo "Begin Building Images for Services"

docker build -t 518307714220.dkr.ecr.ap-southeast-1.amazonaws.com/peerprep/comm:v1 ../CommunicationService/
docker push 518307714220.dkr.ecr.ap-southeast-1.amazonaws.com/peerprep/comm:v1

docker build -t 518307714220.dkr.ecr.ap-southeast-1.amazonaws.com/peerprep/question:v1 ../QuestionService/
docker push 518307714220.dkr.ecr.ap-southeast-1.amazonaws.com/peerprep/question:v1

docker build -t 518307714220.dkr.ecr.ap-southeast-1.amazonaws.com/peerprep/collab:v2 ../CollabSocketService/
docker push 518307714220.dkr.ecr.ap-southeast-1.amazonaws.com/peerprep/collab:v2

docker build -t 518307714220.dkr.ecr.ap-southeast-1.amazonaws.com/peerprep/user:v1 ../UserProfileService/
docker push 518307714220.dkr.ecr.ap-southeast-1.amazonaws.com/peerprep/user:v1