var mongodb = require('./db');

function Post(name, title, post) {
    this.name = name;
    this.title = title;
    this.post = post;
}

module.exports = Post;


Post.prototype.__pagesize = 20;

Post.prototype.__limit_count = 0;
Post.prototype.__limit_id_map = {};
Post.prototype.getPageLimitId = (pageno = 1) => {
    return Post.prototype.__limit_id_map[pageno] || null;
};
Post.prototype.refreshLimitId = () => {
    mongodb.open(function(err, db) {
        if (err) {
            return setTimeout(() => {
                Post.prototype.refreshLimitId();
            }, 5000);
        }
        //读取 posts 分页信息
        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return setTimeout(() => {
                    Post.prototype.refreshLimitId();
                }, 5000);
            }
            collection.find({}).sort({ "_id": -1 }).limit(Post.prototype.__pagesize * 20).toArray(function(err, docs) {
                mongodb.close();
                if (err) {
                    return setTimeout(() => {
                        Post.prototype.refreshLimitId();
                    }, 5000);
                }
                for (let i = 0; i < 20; i++) {

                    if (docs[i * Post.prototype.__pagesize]) {
                        console.log(i, docs[i * Post.prototype.__pagesize]._id)
                        Post.prototype.__limit_id_map[i] = docs[i * Post.prototype.__pagesize]._id;
                    }
                }
                console.log('Post limit id map:', Post.prototype.__limit_id_map);
            });
        });

        //读取 posts 集合count
        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return setTimeout(() => {
                    Post.prototype.refreshLimitId();
                }, 5000);
            }
            collection.find({}).limit(Post.prototype.__pagesize * 20).count(function(err, count) {
                mongodb.close();
                if (err) {
                    return setTimeout(() => {
                        Post.prototype.refreshLimitId();
                    }, 5000);
                }
                Post.prototype.__limit_count = count;
                console.log('Post limit count:', Post.prototype.__limit_count);
            });
        });

    });
};

Post.prototype.refreshLimitId();

//存储一篇文章及其相关信息
Post.prototype.save = function(callback) {
    var date = new Date();
    //存储各种时间格式，方便以后扩展
    var time = {
            date: date,
            year: date.getFullYear(),
            month: date.getFullYear() + "-" + (date.getMonth() + 1),
            day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
            minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
                date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
        }
        //要存入数据库的文档
    var post = {
        name: this.name,
        time: time,
        title: this.title,
        post: this.post
    };
    //打开数据库
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //将文档插入 posts 集合
            collection.insert(post, {
                safe: true
            }, function(err) {
                mongodb.close();
                if (err) {
                    return callback(err); //失败！返回 err
                }
                callback(null); //返回 err 为 null
            });
        });
    });
};

//读取文章及其相关信息
Post.getByAuthor = function(name, callback) {
    //打开数据库
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (name) {
                query.name = name;
            }
            //根据 query 对象查询文章
            collection.find(query).sort({
                time: -1
            }).toArray(function(err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err); //失败！返回 err
                }
                callback(null, docs); //成功！以数组形式返回查询的结果
            });
        });
    });
};

//读取文章及其相关信息
Post.get = function(title, callback) {
    //打开数据库
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (title) {
                query.title = title;
            }
            //根据 query 对象查询文章
            collection.find(query).sort({
                time: -1
            }).toArray(function(err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err); //失败！返回 err
                }
                callback(null, docs); //成功！以数组形式返回查询的结果
            });
        });
    });
};
Post.getPage = (pageno, pagesize = Post.prototype.__pagesize, callback) => {
    pageno = +pageno || 1;
    pagesize = +pagesize;
    pageno--;
    mongodb.open((err, db) => {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            if (Post.prototype.__limit_id_map[pageno] && pagesize == 20) {
                var query = {
                    _id: {
                        $lte: Post.prototype.__limit_id_map[pageno]
                    }
                };
                //根据 query 对象查询文章
                collection.find(query).sort({ "_id": -1 }).limit(pagesize).toArray(function(err, docs) {
                    mongodb.close();
                    if (err) {
                        return callback(err); //失败！返回 err
                    }
                    callback(null, docs, Post.prototype.__limit_count); //成功！以数组形式返回查询的结果
                });
            } else {
                var query = {};
                //根据 query 对象查询文章
                collection.find(query).sort({ "_id": -1 }).skip(pageno * pagesize).limit(pagesize).toArray(function(err, docs) {
                    mongodb.close();
                    if (err) {
                        return callback(err); //失败！返回 err
                    }
                    callback(null, docs, Post.prototype.__limit_count); //成功！以数组形式返回查询的结果
                    if (docs.length && pagesize == 20) Post.prototype.__limit_id_map[pageno] = docs[0]._id;
                });
            }
        });

    });
};