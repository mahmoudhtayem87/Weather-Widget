import { AfterViewInit, Component } from '@angular/core';
import LiferayParams from '../types/LiferayParams'
import { HttpClient } from '@angular/common/http';
declare const Liferay: any;

@Component({
	templateUrl: 
		Liferay.ThemeDisplay.getPathContext() + 
		'/o/Weather-Widget/app/app.component.html'
})
export class AppComponent implements AfterViewInit {
	params: LiferayParams;
	labels: any;
	public WeatherData : any = null;
	constructor(public http:HttpClient) {
		this.labels = {  
			configuration: Liferay.Language.get('configuration'),
			portletNamespace: Liferay.Language.get('portlet-namespace'),
        	contextPath: Liferay.Language.get('context-path'),
			portletElementId: Liferay.Language.get('portlet-element-id'),
		}
		
	}
	get configurationJSON() {
		return JSON.stringify(this.params.configuration, null, 2);
	}
	get APIKey()
	{
		return this.params.configuration.system["APIKey"];
	}
	get Location()
	{
		return this.params.configuration.portletInstance.Location;
	}
	get CurrentLocationAPIKey()
	{
		return this.params.configuration.system["CurrentLocationAPIKey"];
	}
	get UseCurrentLocation()
	{
		return this.params.configuration.portletInstance["UseCurrentLocation"] as boolean;
	}
	public getCurrentWeatherData()
	{
		var key = this.APIKey;
		var location = this.Location;
		this.http
		.get("http://api.weatherapi.com/v1/current.json?key="+key+"&q="+location+"&aqi=yes")
		.subscribe(result=>{
			this.WeatherData = result;
		});
	}
	public getCurrentWeatherDataByLatLNG(Region:any)
	{
		var key = this.APIKey;
		var location = this.Location;
		this.http
		.get("http://api.weatherapi.com/v1/current.json?key="+key+"&q="+Region+"&aqi=yes")
		.subscribe(result=>{
			this.WeatherData = result;
		});
	}
	public ngAfterViewInit() {
		console.log(this.UseCurrentLocation);
		if(!this.UseCurrentLocation)
		this.getCurrentWeatherData();
		else
		this.getCurrentLocation();
	}
	public getCurrentLocation()
	{

		this.http.get("http://ip-api.com/json/?fields=status,message,countryCode,region,regionName")
		.subscribe(result=>{
			console.log(result);
			this.getCurrentWeatherDataByLatLNG(result["regionName"]);
		});
	}
}
