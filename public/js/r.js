!function(e){function t(n){if(a[n])return a[n].exports;var r=a[n]={exports:{},id:n,loaded:!1};return e[n].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var a={};return t.m=e,t.c=a,t.p="",t(0)}({0:function(e,t,a){e.exports=a(5)},5:function(e,t){"use strict";var a=ReactRouter.Router,n=ReactRouter.Route,r=ReactRouter.Link,c=ReactRouter.hashHistory,l=function(){return user?React.createElement("nav",null,React.createElement("span",null,React.createElement("a",{title:"主页",href:"/"},"home")),React.createElement("span",null,React.createElement("a",{title:"发表",href:"/post"},"post")),React.createElement("span",null,React.createElement("a",{title:"登出",href:"/logout"},"logout"))):React.createElement("nav",null,React.createElement("span",null,React.createElement("a",{title:"主页",href:"/"},"home")),React.createElement("span",null,React.createElement("a",{title:"登录",href:"/login"},"login")),React.createElement("span",null,React.createElement("a",{title:"注册",href:"/reg"},"register")))},o=React.createClass({displayName:"Post",render:function(){return React.createElement("div",null,React.createElement("p",null," ",React.createElement("h2",null," ",React.createElement("a",{href:"/article?article="+this.props.title}," ",this.props.title," "))),React.createElement("p",{"class":"info"},"作者： ",React.createElement("a",{href:"/articlelist?author="+this.props.title}," ",this.props.name," ")," | 日期： ",this.props.time))}}),s=React.createClass({displayName:"Nav",getInitialState:function(){return{cur:1}},render:function(){for(var e=[],t=this.props,a=t.pagesize,n=void 0===a?20:a,c=(t.pageno,t.count),l=void 0===c?0:c,o=Math.ceil(l/n),s=1;s<=o;s++)e.push(React.createElement(r,{to:"/list/"+s,activeStyle:this.state.cur==s?{color:"gray"}:{}},s));return React.createElement("p",null,e)},onBtnClick:function(e){var t=parseInt(e.target.innerHTML);this.setState({cur:t}),this.props.onPageChange&&this.props.onPageChange(t)}}),i=React.createClass({displayName:"PostList",getInitialState:function(){return{cur:this.props.pageno||1,loading:!1,posts:[],count:0}},componentDidMount:function(){this.loadData(this.state.cur)},componentWillReceiveProps:function(e){this.loadData(e.pageno)},render:function(){return this.state.loading?React.createElement("article",null,"正在加载……",React.createElement(s,{count:this.state.count,pagesize:this.props.pagesize,onPageChange:this.onPageChange})):React.createElement("article",null,this.state.posts.map(function(e,t){return React.createElement(o,{title:e.title,name:e.name,time:e.time.minute})}),React.createElement(s,{count:this.state.count,pagesize:this.props.pagesize,onPageChange:this.onPageChange}))},onPageChange:function(e){this.loadData(e)},loadData:function(e){var t=this;t.setState({pageno:e,loading:!0});var a=this.props.pagesize||20;$.get("/node/getPage",{pageno:e,pagesize:a},function(a,n){"success"==n&&t.setState({cur:e,posts:a.posts,count:a.count,loading:!1})})}}),p=React.createClass({displayName:"APP",render:function(){return React.createElement("div",null,React.createElement(l,null),React.createElement(i,{pagesize:5,pageno:this.props.params.pageno}))}});ReactDOM.render(React.createElement(a,{history:c},React.createElement(n,{path:"/",component:p}),React.createElement(n,{path:"/list/:pageno",component:p})),document.body)}});
//# sourceMappingURL=r.js.map