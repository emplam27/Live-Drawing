FROM openjdk:11
VOLUME /tmp
EXPOSE 8080
ARG JAR_FILE=build/libs/restserver-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} live-drawing.jar
ENTRYPOINT ["java", "-jar", "/live-drawing.jar"]