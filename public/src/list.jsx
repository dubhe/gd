var Post = React.createClass({
    render: function () {
        return <div>
            <p> <h2> <a href={'/article?article=' + this.props.title}> {this.props.title} </a></h2></p>
            <p class="info" >
                作者： <a href={'/articlelist?author=' + this.props.title}> {this.props.name} </a> |
                日期： {this.props.time}
            </p>
        </div>;
    }
});

var Nav = React.createClass({
    getInitialState: function () {
        return { cur: 1 };
    },
    render: function () {
        var list = [];
        var { pagesize = 20, pageno = 1, count = 0 } = this.props;
        var pagecount = Math.ceil(count / pagesize);
        for (var i = 1; i <= pagecount; i++) {
            list.push(
                <span style={this.state.cur == i ? { color: "gray" } : {}} onClick={this.onBtnClick}>{i}</span>
            );
        }

        return (
            <p>
                {list}
            </p>
        );
    },
    onBtnClick: function (evt) {
        var cur = parseInt(evt.target.innerHTML);
        this.setState({ cur: cur });
        this.props.onPageChange && this.props.onPageChange(cur);
    }

});

var PostList = React.createClass({
    getInitialState: function () {
        return {
            cur: 1,
            loading: false,
            posts: [],
            count: 0
        };
    },
    componentDidMount: function () {
        this.loadData(1);
    },
    render: function () {
        if (this.state.loading) {
            return (
                <div>
                    正在加载……
                    <Nav count={this.state.count} pagesize={this.props.pagesize} onPageChange={this.onPageChange} />
                </div>
            );
        } else {
            var ld = [];
            for (let i = 0; i < this.state.posts.length; i++) {
                ld.push(
                    <Post title={this.state.posts[i].title} name={this.state.posts[i].name} time={this.state.posts[i].time.minute} />
                );
            }

            return (
                <div>
                    {ld}
                    <Nav count={this.state.count} pagesize={this.props.pagesize} onPageChange={this.onPageChange} />
                </div>
            );
        }
    },
    onPageChange: function (pageno) {
        this.loadData(pageno);
    },
    loadData: function (pageno) {

        var self = this;
        self.setState({
            loading: true
        });
        var pagesize = this.props.pagesize || 20;
        $.get('/node/getPage', {
            pageno: pageno,
            pagesize: pagesize
        }, function (data, success) {
            if (success == 'success') {
                self.setState({
                    cur: pageno,
                    posts: data.posts,
                    count: data.count,
                    loading: false
                })
            }
        })
    }
});


ReactDOM.render(
    <PostList pagesize={5} />
    ,
    document.getElementById('list')
);