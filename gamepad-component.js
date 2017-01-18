"use strict"
var
  Defer= require( "observable-defer"),
  gamepads= require( "most-gamepad")({ multiplier: 1}),
  most= require( "most"),
  privateState= new WeakMap()

class GamepadComponent extends HTMLElement {
	static get observedAttributes(){
		return [ "index"]
	}
	constructor(){
		super()
		var defer= Defer()
		privateState.set( this, defer)
		this.observable= most.switchLatest( defer.observable)
	}
	connectedCallback(){
		var index= Number.parseInt( this.getAttribute( "index"))
		if( !index){
			gamepads.get(
				// for whatever reason browser seem to make 0 a non-existant controller often? ok?
				Promise.race([
					gamepads.get(0).then(_ => 0),
					gamepads.get(1).then(_ => 1)
				]).then(index => this.setAttribute( "index", index))
			return
		}
		gamepads.get( index).then( gamepad=> privateState.get(this).next( gamepad))
	}
	attributeChangedCallback( name, oldValue, newValue){
		if( name=== "index"){
			this._next( newValue)
		}
	}
}

module.exports= GamepadComponent
module.exports.GamepadComponent= GamepadComponent
