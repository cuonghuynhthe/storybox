var React = require('react')
export default class Button extends React.Component{
	render(){
		return(
			<button type="submit" className={this.props.className} onClick={this.props.action}>
				{this.props.buttonText}
			</button>
		)
	}
}