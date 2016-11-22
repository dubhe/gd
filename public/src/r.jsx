var Router = ReactRouter.Router
var Route = ReactRouter.Route
var Link = ReactRouter.Link
var hashHistory = ReactRouter.hashHistory


var LeftNav = () => {
    if (user) {
        return <nav>
            <span><a title="主页" href="/">home</a></span>
            <span><a title="发表" href="/post">post</a></span>
            <span><a title="登出" href="/logout">logout</a></span>
        </nav>
    } else {
        return <nav>
            <span><a title="主页" href="/">home</a></span>
            <span><a title="登录" href="/login">login</a></span>
            <span><a title="注册" href="/reg">register</a></span>
        </nav>
    }
};

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
                <Link to={"/list/" + i} activeStyle={this.state.cur == i ? { color: "gray" } : {}} >{i}</Link>
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
            cur: this.props.pageno || 1,
            loading: false,
            posts: [],
            count: 0
        };
    },
    componentDidMount: function () {
        this.loadData(this.state.cur);
    },
    componentWillReceiveProps : function(props){
        this.loadData(props.pageno)
    },
    render: function () {
        if (this.state.loading) {
            return (
                <article>
                    正在加载……
                    <Nav count={this.state.count} pagesize={this.props.pagesize} onPageChange={this.onPageChange} />
                </article>
            );
        } else {
            return (
                <article>
                    {this.state.posts.map((item, index) => {
                        return <Post title={item.title} name={item.name} time={item.time.minute} />
                    })}
                    <Nav count={this.state.count} pagesize={this.props.pagesize} onPageChange={this.onPageChange} />
                </article>
            );
        }
    },
    onPageChange: function (pageno) {
        this.loadData(pageno);
    },
    loadData: function (pageno) {

        var self = this;
        self.setState({
            pageno : pageno,
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

var APP = React.createClass({
    render: function () {
        return <div>
            <LeftNav />
            <PostList pagesize={5} pageno={this.props.params.pageno}/>
        </div>;
    }
});
ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={APP} />
        <Route path="/list/:pageno" component={APP} />
    </Router>
), document.body);