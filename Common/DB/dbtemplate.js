
"use strict";

var pgp = require('pg-promise')();

const express = require("express");
const systemsetting = require('../Config/systemsetting')
/** Database Configuration **/
const databaseConfig = {
    "host": systemsetting.DB_SERVER,
    "port": systemsetting.DB_PORT,
    "database": systemsetting.DB_NAME,
    "user": systemsetting.DB_USER_NAME,
    "password": systemsetting.DB_PASSWORD
};
/** Object to connect database **/
global.db = pgp(databaseConfig);

var query = "";
var columns, values;
module.exports = {
    GetQueryResult: function (tableName, fields, condition, sortingColumn, sortingOrder, limit, callback) {
        if (fields == "" || fields == null)
            fields = '*';
        query = 'SELECT ' + fields + ' FROM ' + tableName;
        if (condition != null && condition.length > 0)
            query = query + ' WHERE ' + condition;
        if (sortingOrder != null && sortingOrder.length > 0)
            query = query + ' ORDER BY ' + sortingColumn + ' ' + sortingOrder;
        if (limit != "" && limit != null) {
            query = query + ' LIMIT ' + limit;
        }

       // console.log("executing the query");

 
       console.log(query);

        db.any(query)
            .then(data => {

                /** to send the function back when succesfully inserted*/
                //console.log("Query Result :: " + JSON.stringify(data));
                callback(null, data);
            })
            .catch(error => {
                /** to send the function back if there is an error */
                callback(error, null);
            });
    },



    InsertQueryResult: function (tableName, fields, callback) {
        var columns = [];
        var values = [];
        /** Itrating Map to and set column names and corresponding values */
        fields.forEach(function (value, key) {
            columns.push(key);

            value = JSON.stringify(value);
            value = "'" + value + "'";

            values.push(value)

        });

        var query = 'INSERT INTO ' + tableName + '(' + columns + ')  values(' + values + ')';


        console.log("Query :: " + query);
        /** Execute the query */
        db.none(query)
            .then(() => {
                console.log("Data succcesfully inserted ");
                /** to send the function back when successfully inserted */
                callback(null, true);
            })
            .catch(error => {
                console.log("Following Error Occured", error);
                /** to send the function back when error occured */
                callback(error, false);
            });
    },


    UpdateQueryResult: function (tableName, fields, conditions, callback) {
        var columns = '';

        /** Itrating Map to get column names and corresponding values */
        fields.forEach(function (value, key) {
            columns = columns + key + " = " + "'" + value + "' ";
            columns = columns + ",";
        });

        /** Trim extra ,(comma) from string */
        columns = columns.slice(0, -1);

        /** Preparing final query*/
        query = 'update ' + tableName + ' set ' + columns + ' where ' + conditions;

        console.log("Executing Query :: ** " + query + " **");

        /** Execute the Query */
        db.none(query)
            .then(() => {
                console.log("Data succesfully updated ");
                /** to send the function back if data is update */
                callback(null, true);
            })
            .catch(error => {
                console.log("errror in updating", error);
                /** to send the function back if there is an error */
                callback(err, 2);
            });

    },

    DeleteQueryResult: function (tableName, condition, callback) {
        query = 'DELETE from ' + tableName + ' WHERE ' + condition;
        db.result(query, false)
            .then(result => {
                console.log('Rows affected: ', result.rowCount)
                callback(null, result.rowCount)
            })
            .catch(error => {
                callback(error, false);
            });
    }

}
