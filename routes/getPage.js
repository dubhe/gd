var Post = require('../models/post.js');

module.exports = (req, res) => {
    Post.getPage(req.query.pageno, req.query.pagesize, (err, posts, count) => {
        if (err) {
            return res.send({
                err: err
            });
        }

        return res.json({
            posts: posts,
            count: count
        });

    });
};