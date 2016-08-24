var React = require('react')
const urlAPI = '/api/comments'
var ReactDOM = require('react-dom')

// module.exports = React.createClass({
// 	render: function(){
// 		return(
// 			<html>
// 				<head>
// 					<title>{this.props.title}</title>
// 					<link rel='stylesheet' href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"/>
// 				</head>
// 				<body>
// 					<App/>
// 					<script dangerouslySetInnerHTML={{
// 						__html: 'window.PROPS=' + JSON.stringify(this.props) 
// 					}}/>
// 					<script src='/bundle.js'/>
// 				</body>
// 			</html>
// 		)
// 	}
// })

// class App extends React.Component {
// 		constructor(){
// 			super()
// 			this.state = { 
// 					val1: 0,
// 					val2: 2,
// 					val3: 3,
// 				}
// 			this.update = this.update.bind(this)
// 		}
// 		update(){
// 			this.setState({
// 				val1: this.state.val1 + 1,
// 				val2: 2
// 				})
// 		}
//     render(){
// 				console.info('rendering')
//         return (
// 					<div>
// 						<ul>
// 							<li>{this.state.val1}</li>
// 							<li>{this.state.val2}</li>
// 							<li>{this.state.val3}</li>
// 						</ul>
// 						<button className="btn btn-success" onClick={this.update}>{this.state.val1}</button>
// 					</div>
// 				)
//     }
// 		componentWillMount(){
// 			console.info('mounting')
// 		}
// 		componentDidMount(){
// 		 console.info('mounted')
// 		}
// }

module.exports = React.createClass({
	render: function(){
		return(
			<html>
				<head>
					<title>{this.props.title}</title>
					<link rel='stylesheet' href='/style.css'/>
					<link rel='stylesheet' href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"/>
    			<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
				</head>
				<body>
					<CommentBox/>
					<script dangerouslySetInnerHTML={{
						__html: 'window.PROPS=' + JSON.stringify(this.props) 
					}}/>
					<script src='/bundle.js'/>
				</body>
			</html>
		)
	}
})

class CommentBox extends React.Component{
	constructor(){
		super()
		this._loadCommentFromServer = this._loadCommentFromServer.bind(this)
		this.state = {
			showComments: false,
			comments: [],
		}
	}

	render(){
		let comments = this.state.comments
		let commentNodes = comments.map((comment) => {
			return (
					<Comment comment={comment} key={comment.id} onDelete={this._deleteComment.bind(this)}/>
				)
		})
		let commentList
		let buttonText = 'Show comments'
		if(this.state.showComments){
			buttonText = 'Hide comments'
			commentList = <div className="comment-list">{commentNodes}</div>
		}
		return(
			<div className="comment-box">
				<h3>My best friend ..... :)</h3>
				<img src="https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/12494804_1189764447702206_1196908997329677672_n.jpg?oh=2f4d2e35a64d7c68369b7b35f389427e&oe=5852140A" className="img-thumbnail" width="320" height="250"/>
				<CommentForm addComment={this._addComment.bind(this)}/>
				<h4 className="commnet-count">{this._getCommentsTitle(comments.length)}</h4>
				<div className="show-hide-comments">
				  <ButtonComponent className="btn btn-primary" buttonText={buttonText} action={this._handleClick.bind(this)}/>
				</div>
				{commentList}
			</div>
		)
	}

	_loadCommentFromServer(){
		$.ajax({
			url: urlAPI,
			dataType: 'json',
      cache: true,
			type: 'GET',
      success: function(data) {
        this.setState({comments: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
		})
	}

	componentDidMount(){
		console.info('mouted')
		this._loadCommentFromServer();
		this._timer = setInterval(this._loadCommentFromServer, 5000)
	}

	componentWillUnmount(){
		console.info('unmouted')
		clearInterval(this._timer)
	}

	_handleClick() {
		this.setState({
			showComments: !this.state.showComments
		})
	}

	_getCommentsTitle(commentCount){
		switch (commentCount) {
			case 0:
				return 'No comments yet'
			case 1:
				return '1 comment'
			default:
				return `${commentCount} comments`
		}
	}

	_getComments(){
		return this.state.comments.map((comment) => {
			return (
					<Comment comment={comment} key={comment.id} onDelete={this._deleteComment.bind(this)}/>
				)
		})
	}

	_addComment(author, message){
		var comments = this.state.comments

		const comment = {
			id: Date.now(),
			author,
			message
		}
		this.setState({comments: comments.concat([comment])})
			jQuery.ajax({
				url: urlAPI,
				dataType: 'json',
				type: 'POST',
				data: comment,
				success: function(data) {
					this.setState({comments: data});
				}.bind(this),
				error: function(xhr, status, err) {
					this.setState({comments: comments});
					console.error(this.props.url, status, err.toString());
				}.bind(this)
		});
	}

	_deleteComment(comment){
		const comments = this.state.comments
		const commentIndex = comments.indexOf(comment)
		comments.splice(commentIndex, 1)
		this.setState({comments})
		$.ajax({
			url: urlAPI,
			dataType: 'json',
			type: 'PUT',
			data: comment,
			success: function(data) {
				this.setState({comments: data});
			}.bind(this),
			error: function(xhr, status, err) {
				this.setState({comments: comments});
				console.error(this.props.url, status, err.toString());
			}.bind(this)
			});
	}
}

class CommentForm extends React.Component{
	render(){
		return (
			<form className="comment-form" onSubmit={this._handleSubmit.bind(this)}>
				<h3>New Comment</h3>
				<div className="comment-form-fields">
					<input placeholder="Name:" className="form-control margin-bottom" ref={(input) => this._author = input}/>
					<textarea placeholder="Comment:" className="form-control margin-bottom" ref={(textarea) => this._message = textarea}></textarea>
				</div>
				<div className="comment-form-actions">
					<ButtonComponent className="btn btn-success" buttonText="Post comment"/>
				</div>
			</form>
		)
	}
	_handleSubmit(event){
		event.preventDefault();

		let author = this._author
		let message = this._message
		if(!author.value || !message.value){
			return
		}
		this.props.addComment(author.value, message.value)
	  
		this._author.value = ''
		this._message.value = ''
	}
}

class Comment extends React.Component{
	render(){
		return(
			<div className="comment">
				<p className="comment-header">{this.props.comment.author}</p>
				<p className="comment-body">{this.props.comment.message}</p>
				<div className="comment-footer">
					<ButtonComponent 
							
							buttonText="Delete comment" 
							action={this._handleDelete.bind(this)}/>
				</div>
			</div>
		)
	}
	_handleDelete(event){
		event.preventDefault()
		this.props.onDelete(this.props.comment)
	}
}

class ButtonComponent extends React.Component{
	render(){
		return(
			<button type="submit" 
							className={this.props.className} 
							onClick={this.props.action}>
							{this.props.buttonText}
			</button>
		)
	}
}

ButtonComponent.defaultProps = {
	className: 'btn btn-default'
}

ButtonComponent.propTypes = {
	className: React.PropTypes.string,
	// name: React.PropTypes.string.isRequired
}





