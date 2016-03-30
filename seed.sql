#!/bin/bash
  
EXPECTED_ARGS=4
E_BADARGS=65
MYSQL=`which mysql`
  
Q1="CREATE DATABASE IF NOT EXISTS $1;"
Q2="GRANT USAGE ON *.* TO $3@localhost IDENTIFIED BY '$4';"
Q3="GRANT ALL PRIVILEGES ON $1.* TO $3@localhost;"
Q4="USE $1;"
Q5="CREATE TABLE IF NOT EXISTS $2 (id int(5) NOT NULL AUTO_INCREMENT, json BLOB NOT NULL, PRIMARY KEY (id));"
Q6="FLUSH PRIVILEGES;"
SQL="${Q1}${Q2}${Q3}${Q4}${Q5}${Q6}"
  
if [ $# -ne $EXPECTED_ARGS ]
then
  echo "Usage: $0 dbname dbtable dbuser dbpass"
  exit $E_BADARGS
fi
  
$MYSQL --user=$3 --password=$4 -e "$SQL"

