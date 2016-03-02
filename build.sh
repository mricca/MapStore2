#!/bin/bash
mvn clean install  -DskipTests -Pgeostore,proxy,extjs,postgres,h2_disk
