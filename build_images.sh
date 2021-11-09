echo "Begin Building Images for Services"

docker build -t peerprep/user:latest ./UserProfileService/
docker build -t peerprep/question:latest ./QuestionService/
docker build -t peerprep/comm:latest ./CommunicationService/
docker build -t peerprep/collab:latest ./CollabSocketService/
