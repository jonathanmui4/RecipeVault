# Use Eclipse Temurin JDK 17 for building (supports ARM64 for m series mac)
FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN ./mvnw dependency:go-offline -B

COPY src src

RUN ./mvnw clean package -DskipTests

# Runtime stage - use JRE for smaller image
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 9000

ENTRYPOINT ["java", "-jar", "app.jar"]