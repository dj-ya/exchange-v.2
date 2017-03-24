
//Компонент Дата и Время
var DateTime = React.createClass(
{
	getInitialState : function(){
        return {dateTime: ""};
    },
	componentDidMount: function() {
		setInterval(() => this.setState({dateTime: this.getTime()}), 1000);
    },
	getTime: function()
	{
		 var datetimeval = new Date();
		 var content = []
		 content["date"] = (datetimeval.getDate()<10 ? "0" : "")+datetimeval.getDate()+"-"+(datetimeval.getMonth()<10 ? "0" : "")+(datetimeval.getMonth()+1)+"-"+(datetimeval.getFullYear());
		 content["time"] =(datetimeval.getHours()<10 ? "0" : "")+datetimeval.getHours() +":"+ (datetimeval.getMinutes()<10 ? "0" : "")+datetimeval.getMinutes()/*  +":"+datetimeval.getSeconds() */  ;
		return content;
	},
	render: function(){
		return (
			<div className="col-lg-2 col-md-2 datetime">
				{this.state.dateTime.time}
				<br />
				{this.state.dateTime.date}
			</div>
		);
	}
});

//Компонент через ES2015
class Header extends React.Component{
  render() {
    return (
      <div className="header_div">
        <div className="col-lg-4 col-md-4"><img src={this.props.logo_src} className="img-responsive" /></div>
        <div className="col-lg-6 col-md-6 title">Курсы обмена валют</div>
        <DateTime />
      </div>
    );
  }
}

//Компонент приложение
var Running_string = React.createClass(
{
	render: function(props){
		return (
			<marquee className="running_string" behavior="scroll" direction="left" >
				{this.props.text}
			</marquee>
		);
	}
});

//Компонент через ES2015
class Rates extends React.Component{
	constructor(props) {
    super(props);
    this.state = {"currencies": [], "app_info": {}};
		this.getRates = this.getRates.bind(this);
  }
	getRates(){
		let me = this;
		$.ajax({
			url: 'database.json',
			type: 'post',
			error: function()
					{
						$('#error').show();
					},
			dataType: 'json',
			success: function(currencyList) {
				me.setState({"currencies": currencyList.currencies, "app_info": currencyList});
			}
		});
	}
	componentDidMount(){
		this.getRates();
		setInterval(this.getRates, 10000);
	}
  render() {
    return (
			<div className="currencies col-lg-12 col-md-12">
				<table>

				{
					this.state.currencies.map(function(item,i){
						//Показываем валюты без объемов
							let imgSrc = "img/flags/"+item.icon+".png";
							let spec_price_Array = []
							if(item.special_price.length>0){
								 spec_price_Array = item.special_price.map(function(itemSP,i){
									//Показываем валюты без объемов
										return(<tr><td></td><td className="currency_title">&nbsp; {itemSP.title}</td><td className="buy">{itemSP.price_purchase}</td><td className="sale">{itemSP.price_sale} </td></tr>);
								});
								return ([<tr><td><img src={imgSrc} className="icon" /></td><td className="currency_title">{item.title}</td><td className="buy">Покупка</td><td className="sale">Продажа </td></tr>,spec_price_Array]);
							}

					})
				}
				</table>
				<br /><br />
				<table>
				<tr><td></td><td className="currency_title"></td><td className="buy">Покупка</td><td className="sale">Продажа </td></tr>
				{
					this.state.currencies.map(function(item,i){
						//Показываем валюты без объемов
						  let imgSrc = "img/flags/"+item.icon+".png";
							if(item.special_price.length==0) return(<tr><td><img src={imgSrc} className="icon" /></td><td className="currency_title">{item.title}</td><td className="buy">{item.price_purchase}</td><td className="sale">{item.price_sale} </td></tr>);
					})
				}
				</table>
				<Running_string text={this.state.app_info.app_running_string} />
			</div>
    );
  }
}

//Компонент приложение
var App = React.createClass(
{
	render: function(){
		return (
			<div>
        <Header logo_src="../img/logo.png" />
				<Rates />
			</div>
		);
	}
});


ReactDOM.render(<App />, document.getElementById('root'));
