const mongoClient = require('mongodb').MongoClient;

class MongoDB {
    constructor(url) {
        this.url = url;
        //this.findAggregatedRecords=this.findAggregatedRecords.bind(this);

    }

    createDatabase(databaseUrl) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(databaseUrl, function (error, db) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    let doc = {"message": "New database created"};
                    db.collection("README").insertOne(doc, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            db.close();
                            resolve("success");
                        }
                    });
                }
            });
        });
    };

    createUser(databaseUrl, database, user, password) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(databaseUrl, function (error, db) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    const doc = {
                        roles: [{
                            role: "userAdmin",
                            db: database
                        }, {
                            role: "readWrite",
                            db: database
                        }]
                    };
                    db.addUser(user, password, doc, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            db.close();
                            resolve("success");
                        }
                    });
                }
            });
        });
    };

    createCollection(collection) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {
                    db.createCollection(collection, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            db.close();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };

    createRecord(collection, document) {

        return new Promise((resolve, reject) => {
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {
                    db.collection(collection).insertOne(document, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            db.close();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };

    countRecord(collection, query) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {
                    db.collection(collection).count(query, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            db.close();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };

    findRecord(collection, query, fields) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {
                    if (!fields) {
                        fields = {};
                    }
                    db.collection(collection).find(query, fields).toArray(function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            db.close();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };

    findSortedRecord(collection, query, fields, sort) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {
                    if (!fields) {
                        fields = {};
                    }
                    db.collection(collection).find(query, fields).sort(sort).toArray(function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            db.close();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };

    updateRecord(collection, query, values) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {
                    db.collection(collection).updateOne(query, values, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            db.close();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };

    updateRecords(collection, query, values) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {
                    db.collection(collection).updateMany(query, values, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            db.close();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };

    updateRecordWithUpsert(collection, query, values) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {
                    db.collection(collection).updateOne(query, values, {upsert: true}, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            db.close();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };

    findAggregatedRecords(collection, array) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {
                    db.collection(collection).aggregate(array).toArray(function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            db.close();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };

    findAggregatedRecordsPaginator(collection, array, skip, limit) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {
                    db.collection(collection).aggregate(array).skip(skip * limit).limit(limit).toArray(function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            db.close();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };

    fetchSequenceValue(sequenceName) {

        return new Promise((resolve, reject) => {
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {
                    db.collection("counters").findOneAndUpdate({_id: sequenceName}, {$inc: {sequence: 1,notification_count:1}}, {returnOriginal: false}, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            console.log(res.value.sequence);
                            db.close();
                            resolve(res.value.sequence);
                        }
                    });
                }
            });
        });
    };

    fetchNotificationCount(sequenceName) {

        return new Promise((resolve, reject) => {
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {

                    db.collection("counters").fetch({_id: sequenceName}, {$inc: {sequence: 1,notification_count:1}}, {returnOriginal: false}, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            console.log(res.value.sequence);
                            db.close();
                            resolve(res.value.sequence);
                        }
                    });
                }
            });
        });
    };

    setNotificationCount(query,values) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {
                    db.collection("counters").findOneAndUpdate(query,values, {returnOriginal: false}, function (err, res) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            // console.log(res.value.sequence);
                            db.close();
                            resolve(res)
                            // resolve(res.value.sequence);
                        }
                    });
                }
            });
        });
    };

    emptyCollection(collection) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {
                    db.collection(collection).deleteMany({}, {}, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            db.close();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };

    insertRecords(collection, documents) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {
                    db.collection(collection).insertMany(documents, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            db.close();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };

    deleteRecord(collection, query) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {
                    db.collection(collection).deleteOne(query, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            // console.log(res);
                            db.close();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };

    deleteRecords(collection, query) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {
                    db.collection(collection).deleteMany(query, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            // console.log(res);
                            db.close();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };

    findAndUpdate(collection, query, values) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {
                    db.collection(collection).findOneAndUpdate(query, values, {returnOriginal: false}, function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    // console.log(res);
                    db.close();
                    resolve(res);
                }
            });
    }
            });
        });
    };

    findRecordPager(collection, query, skip, limit) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {
                    db.collection(collection).find(query).skip(skip * limit).limit(limit).toArray(function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            db.close();
                            resolve(res);
                        }
                    });
                }
            });
        });

    };

    countRecordAggregate(collection, key, query) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {
                    db.collection(collection).distinct(key,query,function (err,res) {
                        if (err) {
                            reject(err);
                        } else {
                            db.close();
                            resolve(res);
                        }
                    })
                }
            });
        });
    };

    //copy flows from bot_flows to flow_versions







    copyFlowsToVersion(sourceCollection,targetCollection,findQuery,recordExist,popFlow){
        return new Promise((resolve,reject)=>{
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {
                    if(!recordExist){
                    db.collection(sourceCollection).find(findQuery).forEach(function(doc){db.collection(targetCollection).insertOne(
                        {"bot_key":doc.bot_key,
                             "version_counter":1,
                            "versions":[{
                            "flow_version":doc.flow_version,
                            "flows":doc.flows, "configs":doc.configs,
                            "createdOn":doc.createdOn,
                            "modifiedOn":doc.modifiedOn,
                            "train_status":doc.train_status
                            }] }, function (err, res) {
                            if (err) {
                                reject(err);
                            } else {
                                // console.log(res);
                                db.close();
                                resolve(res);
                            }
                        })})}else{
                        db.collection(sourceCollection).find(findQuery).forEach(function(doc){db.collection(targetCollection).updateOne(
                            { bot_key: doc.bot_key },
                            {
                                $inc: { version_counter: 1 },
                                $push: { versions: {
                                        "flow_version":doc.flow_version,
                                        "flows":doc.flows, "configs":doc.configs,
                                        "createdOn":doc.createdOn,
                                        "modifiedOn":doc.modifiedOn,
                                        "train_status":doc.train_status
                                    } }, }

                            , function (err, res) {
                                if (err) {
                                    reject(err);
                                } else {
                                    // console.log(res);
                                    db.close();
                                    resolve(res);
                                }
                            })})
                    }

                }
            });


        })


    }




    copyFlowsToBotFlows(sourceCollection,targetCollection,param){
        return new Promise((resolve,reject)=>{
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {

                        db.collection(sourceCollection).find({"bot_key": param.bot_key,"versions.flow_version": param.flow_version},{_id: 0, versions: {$elemMatch: {flow_version: param.flow_version}}}).forEach(function(doc){db.collection(targetCollection).updateOne(
                            {"bot_key":param.bot_key},
                                { $set :{
                                    "flow_version":doc.versions[0].flow_version,
                                    "flows":doc.versions[0].flows,
                                     "configs":doc.versions[0].configs,
                                    "createdOn":doc.versions[0].createdOn,
                                    "modifiedOn":doc.versions[0].modifiedOn,
                                    "train_status":doc.versions[0].train_status
                                }}, function (err, res) {
                                if (err) {
                                    reject(err);
                                } else {
                                    // console.log(res);
                                    db.close();
                                    resolve(res);
                                }
                            } )})

                }
            });


        })



    }




}

module.exports = MongoDB;

//db.user.find({userId:3}).forEach(function(d){db.getSiblingDB('testDb')['extra'].update({},{$set:{slice:d.slice}}) });