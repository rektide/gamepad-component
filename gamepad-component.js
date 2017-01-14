var
  MostCreate= require( "most-cree8"),
  gamepad= require( "most-gamepad")({ multiplier: 1})

class GamepadComponent extends HTMLElement {
	static get observedAttributes(){
		return ["index"]
	}
	constructor(){
		super()
		this.stream= MostCreate( next=> this._next= next).switchLatest()
	}
	connectedCallback(){
		if( !this.getAttribute( "index")){
			this.setAttribute( "index", 0)
			// for whatever reason browser seem to make 0 a non-existant controller often? ok?
			Promise.race([
				gamepad.get(0).then(_ => 0),
				gamepad.get(1).then(_ => 1)
			]).then(index => this.setAttribute( "index", index))
		}
	}
	attributeChangedCallback( name, oldValue, newValue){
		if( name=== "index"){
			this._next( newValue)
		}
	}
}

module.exports= GamepadComponent
module.exports.GamepadComponent= GamepadComponent
