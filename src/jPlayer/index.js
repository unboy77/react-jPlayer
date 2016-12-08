import React from "react";
import merge from "lodash.merge";
import isEqual from "lodash/isEqual";
import store from "../store";
import * as util from "../util/index";
import * as constants from "../util/constants";
import * as actions from "./actions";
import Gui from "./gui";
import Progress from "./progress";
import Poster from "./poster";
import browserUnsupported from "./browserUnsupported";
import Player from "./player";
import convertTime from "./convertTime";
import {connect} from "react-redux";
import { bindActionCreators } from 'redux';

const mapStateToProps = (state) => {
	return {
		...state.jPlayer
	}
};

const mapDispatchToProps = (dispatch) => (bindActionCreators(actions, dispatch));

export default (WrappedComponent) => connect(mapStateToProps, mapDispatchToProps)(
	class extends React.Component {
		constructor(props) {
			super(props);

			this.state = {};

			
		}
		static get propTypes() {
			return {
				updateOptions: React.PropTypes.func.isRequired,
				jPlayerSelector: React.PropTypes.string,
				cssSelectorAncestor: React.PropTypes.string,
				html: React.PropTypes.objectOf(React.PropTypes.element),
				supplied: React.PropTypes.arrayOf(React.PropTypes.string),
				preload: React.PropTypes.string,
				volume: React.PropTypes.number,
				muted: React.PropTypes.bool,
				remainingDuration: React.PropTypes.bool,
				toggleDuration: React.PropTypes.bool,
				captureDuration: React.PropTypes.bool,
				playbackRate: React.PropTypes.number,
				defaultPlaybackRate: React.PropTypes.number,
				minPlaybackRate: React.PropTypes.number,
				maxPlaybackRate: React.PropTypes.number,
				stateClass: React.PropTypes.objectOf(React.PropTypes.string),
				smoothPlayBar: React.PropTypes.bool,
				fullScreen: React.PropTypes.bool,
				fullWindow: React.PropTypes.bool,
				autoHide: React.PropTypes.shape({
					restored: React.PropTypes.bool, // Controls the interface autohide feature.
					full: React.PropTypes.bool, // Controls the interface autohide feature.
					hold: React.PropTypes.number, // Milliseconds. The period of the pause before autohide beings.
				}),
				loop: React.PropTypes.string,
				
				noFullWindow: React.PropTypes.objectOf(React.PropTypes.string),
				noVolume: React.PropTypes.objectOf(React.PropTypes.string),
				timeFormat: React.PropTypes.shape({
					showHour: React.PropTypes.bool,
					showMin: React.PropTypes.bool,
					showSec: React.PropTypes.bool,
					padHour: React.PropTypes.bool,
					padMin: React.PropTypes.bool,
					padSec: React.PropTypes.bool,
					sepHour: React.PropTypes.string,
					sepMin: React.PropTypes.string,
					sepSec: React.PropTypes.string
				}),
				keyEnabled: React.PropTypes.bool,
				audioFullScreen: React.PropTypes.bool,		
				verticalVolume: React.PropTypes.bool,
				verticalPlaybackRate: React.PropTypes.bool,
				globalVolume: React.PropTypes.bool, // Set to make volume and muted changes affect all jPlayer instances with this option enabled
				sizeCssClass: React.PropTypes.string,
				sizeFullCssClass: React.PropTypes.string,
				shuffleAnimation: React.PropTypes.shape({
					stiffness: React.PropTypes.number, 
					damping: React.PropTypes.number, 
					precision: React.PropTypes.number
				}),
				displayAnimation: React.PropTypes.shape({
					stiffness: React.PropTypes.number, 
					damping: React.PropTypes.number, 
					precision: React.PropTypes.number
				}),
				removeAnimation: React.PropTypes.shape({
					stiffness: React.PropTypes.number, 
					damping: React.PropTypes.number, 
					precision: React.PropTypes.number
				}),
				addAnimation: React.PropTypes.shape({
					stiffness: React.PropTypes.number, 
					damping: React.PropTypes.number, 
					precision: React.PropTypes.number
				}),
				onProgress: React.PropTypes.func,
				onLoadedData: React.PropTypes.func,
				onTimeUpdate: React.PropTypes.func,
				onDurationChange: React.PropTypes.func,
				onPlay: React.PropTypes.func,
				onPlaying: React.PropTypes.func,
				onPause: React.PropTypes.func,
				onWaiting: React.PropTypes.func,
				onSeeking: React.PropTypes.func,
				onSeeked: React.PropTypes.func,
				onVolumeChange: React.PropTypes.func,
				onRateChange: React.PropTypes.func,
				onSuspend: React.PropTypes.func,
				onEnded: React.PropTypes.func,
				onError: React.PropTypes.func,
				onLoadStart: React.PropTypes.func,
				onAbort: React.PropTypes.func,
				onEmptied: React.PropTypes.func,
				onStalled: React.PropTypes.func,
				onLoadedMetadata: React.PropTypes.func,
				onCanPlay: React.PropTypes.func,
				onCanPlayThrough: React.PropTypes.func,
			}
		}
		static get defaultProps() {
			return {
				cssSelectorAncestor: "jp_container_1",
				jPlayerSelector: "jplayer_1",
				preload: "metadata", // HTML5 Spec values: none, metadata, auto.	
				captureDuration: true, // When true, clicks on the duration are captured and no longer propagate up the DOM.	
				minPlaybackRate: 0.5,
				maxPlaybackRate: 4,			
				guiFadeInAnimation: {
					stiffness: 40 // Velocity of the animation (higher the faster), other properties automatically set in the Motion component
				},
				guiFadeOutAnimation: {
					stiffness: 40 
				},
				html: {},
				src: "",
				media: {},
				paused: true,
				format: {},
				formatType: "",
				waitForPlay: true, // Same as waitForLoad except in case where preloading.
				waitForLoad: true,
				srcSet: false,
				video: false, // True if playing a video
				seekPercent: 0,
				currentPercentRelative: 0,
				currentPercentAbsolute: 0,
				currentTime: 0,
				duration: 0,
				remaining: 0,
				videoWidth: 0, // Intrinsic width of the video in pixels.
				videoHeight: 0, // Intrinsic height of the video in pixels.
				readyState: 0,
				networkState: 0,
				playbackRateStatus: 1, // Warning - Now both an option and a status property
				ended: 0,
				[constants.keys.PLAYER_CLASS]: [],
				[constants.keys.PLAY_CLASS]: [constants.classNames.PLAY],
				[constants.keys.PAUSE_CLASS]: [constants.classNames.PAUSE],
				[constants.keys.POSTER_CLASS]: [],
				[constants.keys.VIDEO_CLASS]: [],
				[constants.keys.VIDEO_PLAY_CLASS]: [],
				[constants.keys.REPEAT_CLASS]: [constants.classNames.REPEAT],
				[constants.keys.FULL_SCREEN_CLASS]: [constants.classNames.FULL_SCREEN],
				[constants.keys.VOLUME_MAX_CLASS]: [constants.classNames.VOLUME_MAX],
				[constants.keys.VOLUME_BAR_CLASS]: [constants.classNames.VOLUME_BAR],
				[constants.keys.VOLUME_BAR_VALUE_CLASS]: [constants.classNames.VOLUME_BAR_VALUE],
				[constants.keys.PLAYBACK_RATE_BAR_CLASS]: [constants.classNames.PLAYBACK_RATE_BAR],
				[constants.keys.PLAYBACK_RATE_BAR_VALUE_CLASS]: [constants.classNames.PLAYBACK_RATE_BAR_VALUE],
				[constants.keys.SEEK_BAR_CLASS]: [constants.classNames.SEEK_BAR],
				[constants.keys.NO_SOLUTION_CLASS]: [constants.classNames.NO_SOLUTION]
			};
		}
		_setupOptions = () => {
			this.timeFormats = merge(constants.timeFormats, this.props.timeFormats);
			this.internal = {
				// On iOS, assume the commands will be ignored before the user initiates them.
				cmdsIgnored: constants.platform.ipad || constants.platform.iphone || constants.platform.ipod
				// htmlDlyCmdId: undefined
				// mouse: undefined
			};	
			this.loopOptions = [
				constants.loopOptions.OFF,
				constants.loopOptions.LOOP
			].concat(this.props.loopOptions);	

			// Classes added to the cssSelectorAncestor to indicate the state.
			this.stateClass = merge({ 
				playing: constants.classNames.states.PLAYING,
				seeking: constants.classNames.states.SEEKING,
				muted: constants.classNames.states.MUTED,
				looped: constants.classNames.states.LOOPED,
				fullScreen: constants.classNames.states.FULL_SCREEN,
				noVolume: constants.classNames.states.NO_VOLUME,
			}, this.props[constants.keys.STATE_CLASS]);

			this.autoHide = merge({
				restored: false, // Controls the interface autoHide feature.
				full: true, // Controls the interface autoHide feature.
				hold: 2000 // Milliseconds. The period of the pause before autoHide beings.
			}, this.props.autoHide);

			this.noFullWindow = merge({
				...constants.noFullWindows
			}, this.props.noFullWindow);

			this.noVolume = merge({
				...constants.noVolumes
			}, this.props.noVolume);	
		}
		_setupEvents = () => {
			this.mediaEvent = { 
				onProgress: () => {
					if(this.internal.cmdsIgnored && this.readyState > 0) { // Detect iOS executed the command
						this.internal.cmdsIgnored = false;
					}
					this._getHtmlStatus(this.currentMedia, null, () => {
						this._updateInterface();
						this._trigger(this.props.onProgress);
					});				
				},
				onLoadedData: () => {				
					this.androidFix.setMedia = false; // Disable the fix after the first progress event.
					if(this.androidFix.play) { // Play Android audio - performing the fix.
						this.androidFix.play = false;
						this.props.updateOption("paused", false);
						this.props.updateOption("currentTime", this.androidFix.time);
					}
					if(this.androidFix.pause) { // Pause Android audio at time - performing the fix.
						this.androidFix.pause = false;
						this.props.updateOption("paused", true);
						this.props.updateOption("currentTime", this.androidFix.time);
					}
					this._trigger(this.props.onLoadedData);
				},
				onTimeUpdate: () => {		
					this._getHtmlStatus(this.currentMedia);
					this._trigger(this.props.onTimeUpdate);
				},
				onDurationChange: () => {			
					this._getHtmlStatus(this.currentMedia);	
					this._trigger(this.props.onDurationChange);
				},
				onPlay: () => {			
					this._updateButtons(true);
					this._htmlCheckWaitForPlay(); // So the native controls update this variable and puts the hidden interface in the correct state. Affects toggling native controls.
					this._trigger(this.props.onPlay);
				},
				onPlaying: () => {			
					this._updateButtons(true);
					this._seeked();
					this._trigger(this.props.onPlaying);
				},
				onPause: () => {				
					this._updateButtons(false);
					this._trigger(this.props.onPause);
				},
				onWaiting: () => {			
					this._seeking();
					this._trigger(this.props.onWaiting);
				},
				onSeeking: () => {
					this._seeking();
					this._trigger(this.props.onSeeking);
				},
				onSeeked: () => {			
					this._seeked();
					this._trigger(this.props.onSeeked);
				},
				onVolumeChange: () => {	
					this._updateMute();
					this._updateVolume();
					this._trigger(this.props.onVolumeChange);
				},
				onRateChange: () => {				
					this._updatePlaybackRate();
					this._trigger(this.props.onRateChange);
				},
				onSuspend: () => { // Seems to be the only way of capturing that the iOS4 constants.browser did not actually play the media from the page code. ie., It needs a user gesture.				
					this._seeked();
					this._trigger(this.props.onSuspend);
				},
				onEnded: () => {			
					// Order of the next few commands are important. Change the time and then pause.
					// Solves a bug in Firefox, where issuing pause 1st causes the media to play from the start. ie., The pause is ignored.
					if(!constants.browser.webkit) { // Chrome crashes if you do this in conjunction with a setMedia command in an ended event handler. ie., The playlist demo.
						this.currentMedia.currentTime = 0; // Safari does not care about this command. ie., It works with or without this line. (Both Safari and Chrome are Webkit.)
					}
					// Pause otherwise a click on the progress bar will play from that point, when it shouldn't, since it stopped playback.
					this.props.updateOption("paused", true);
					this._updateButtons(false);
					// With override true. Otherwise Chrome leaves progress at full.
					this._getHtmlStatus(this.currentMedia, true);
					this._trigger(this.props.onEnded);
					if (this.props.loop === "loop") {	
						this._trigger(this.props.onRepeat);
					}
				},
				onError: () => {		
					this._updateButtons(false);
					this._seeked();
					if(this.props.srcSet) { // Deals with case of clearMedia() causing an error event.
						clearTimeout(this.internal.htmlDlyCmdId); // Clears any delayed commands used in the HTML solution
						this.props.updateOption("waitForLoad", true);
						this.props.updateOption("waitForPlay", true);
						
						if(this.props.video && !this.props.nativeVideoControls) {
							this.props.addUniqueToArray(constants.keys.VIDEO_CLASS, constants.classNames.HIDDEN);
						}

						if(util.validString(this.props.media.poster) && !this.props.nativeVideoControls) {
							this.props.removeFromArrayByValue(constants.keys.POSTER_CLASS, constants.classNames.HIDDEN);
						}
						this.props.removeFromArrayByValue(constants.keys.VIDEO_PLAY_CLASS, constants.classNames.HIDDEN);

						this._error( {
							type: constants.errors.URL,
							context: this.props.src, // this.src shows absolute urls. Want context to show the url given.
							message: constants.errorMessages.URL,
							hint: constants.errorHints.URL
						});
					}
					this._trigger(this.props.onError);
				},
				onLoadStart: () => this._trigger(this.props.onLoadStart),
				onAbort: () => this._trigger(this.props.onAbort),
				onEmptied: () => this._trigger(this.props.onEmptied),
				onStalled: () => this._trigger(this.props.onStalled),
				onLoadedMetadata: () => this._trigger(this.props.onLoadedMetadata),
				onCanPlay: () => this._trigger(this.props.onCanPlay),
				onCanPlayThrough: () => this._trigger(this.props.onCanPlayThrough)
			};
		}
		_initBeforeRender = () => {
			this._setupOptions();
			this._setupEvents();

			// Add key bindings focusInstance to 1st jPlayer instanced with key control enabled.
			if(this.props.keyEnabled && !util.focusInstance) {
				util.focusInstance = this;
			}

			// A fix for Android where older (2.3) and even some 4.x devices fail to work when changing the *audio* SRC and then playing immediately.
			this.androidFix = {
				setMedia: false, // True when media set
				play: false, // True when a progress event will instruct the media to play
				pause: false, // True when a progress event will instruct the media to pause at a time.
				time: NaN // The play(time) parameter
			};	

			// Now required types are known, finish the options default settings.
			if(this.props.video.require) {
				this.props.addUniqueToArray(constants.keys.PLAYER_CLASS, "jp-video");
				if (this.props.sizeCssClass !== undefined) {
					this.props.updateOption(constants.keys.SIZE_CLASS, "jp-video-270p");
				}

				if (this.props.sizeFullCssClass !== undefined) {
					this.props.updateOption(constants.keys.SIZE_FULL_CLASS, "jp-video-full");	
				}		
			} else {
				this.props.addUniqueToArray(constants.keys.PLAYER_CLASS, "jp-audio");
			}

			const sizeClass = this.props.fullScreen ? this.props.sizeFullCssClass : this.props.sizeCssClass;
			if (sizeClass !== undefined) {
				this.props.addUniqueToArray(constants.keys.PLAYER_CLASS, this.stateClass[sizeClass]);
				//this.props.updateOption("cssClass", sizeClass);
			}	
			
			this.props.addUniqueToArray(constants.keys.POSTER_CLASS, constants.classNames.HIDDEN);

			this.props.updateOption("noVolume", util.uaBlocklist(this.props.noVolume));
			this.props.updateOption("noFullWindow", util.uaBlocklist(this.props.noFullWindow));
		}
		_initAfterRender = () => {
			if (constants.platform.android) {
				this.props.updateOption("preload", this.props.preload !== 'auto' ? 'metadata' : 'auto');
			}

			// Set up the css selectors for the control and feedback entities.
			this._cssSelectorAncestor();

			// If html is not being used by this constants.browser, then media playback is not possible. Trigger an error event.
			// if(!this.html.used) {
			// 	this._error({
			// 		type: constants.errors.NO_SOLUTION,
			// 		context: "{solution:'" + this.props.solution + "', supplied:'" + this.props.supplied.join(", ") + "'}",
			// 		message: constants.errorMessages.NO_SOLUTION,
			// 		hint: constants.errorHints.NO_SOLUTION
			// 	});
			// 	this.props.removeFromArrayByValue(constants.keys.NO_SOLUTION_CLASS, constants.classNames.HIDDEN);
			// } else {
			// 	this.props.addUniqueToArray(constants.keys.NO_SOLUTION_CLASS, this.props[constants.keys.NO_SOLUTION_CLASS], constants.classNames.HIDDEN);
			// }

			if(this.props.nativeVideoControls) {
				this.props.removeFromArrayByValue(constants.keys.VIDEO_CLASS, constants.classNames.HIDDEN);
				this.setState({videoStyle: {
					width: this.props.width, 
					height: this.props.height
				}});
			} else {
				this.props.addUniqueToArray(constants.keys.VIDEO_CLASS, constants.classNames.HIDDEN);
			}		
			
			this._updatePlaybackRate();

			// The other controls are now setup in _cssSelectorAncestor()
			this.props.addUniqueToArray(constants.keys.VIDEO_PLAY_CLASS, constants.classNames.HIDDEN);
		}	
		_getHtmlStatus = (media, override) => {
			let ct = 0, cpa = 0, sp = 0, cpr = 0;

			const duration = media.duration;

			ct = media.currentTime;
			cpa = (duration > 0) ? 100 * ct / duration : 0;
			if((typeof media.seekable === "object") && (media.seekable.length > 0)) {
				sp = (duration > 0) ? 100 * media.seekable.end(media.seekable.length-1) / duration : 100;
				cpr = (duration > 0) ? 100 * media.currentTime / media.seekable.end(media.seekable.length - 1) : 0; // Duration conditional for iOS duration bug. ie., seekable.end is a NaN in that case.
			} else {
				sp = 100;
				cpr = cpa;
			}

			if(override) {
				ct = 0;
				cpr = 0;
				cpa = 0;
			}

			this.props.updateOption("seekPercent", sp);
			this.props.updateOption("currentPercentRelative", cpr);
			this.props.updateOption("currentPercentAbsolute", cpa);
			this.props.updateOption("currentTime", ct);
			this.props.updateOption("remaining", duration - ct);
			// Fixes the duration bug in iOS, where the durationchange event occurs when media.duration is not always correct.
			// Fixes the initial duration bug in BB OS7, where the media.duration is infinity and displays as NaN:NaN due to Date() using inifity.
			this.props.updateOption("duration", isFinite(media.duration) ? duration : this.props.duration);
			this.props.updateOption("videoWidth", media.videoWidth);
			this.props.updateOption("videoHeight", media.videoHeight);
			this.props.updateOption("readyState", media.readyState);
			this.props.updateOption("networkState", media.networkState);
			this.props.updateOption("playbackRate", media.playbackRate);
			this.props.updateOption("ended", media.ended);
		}
		_trigger = (func, error) => {
			var jPlayerOptions = {
				version: Object.assign({}, util.version),
				element: this.currentMedia,
				html: merge({}, this.html), // Deep copy
				error: Object.assign({}, error)
			}

			if (func !== undefined) {
				func.bind(this)(jPlayerOptions);
			}
		}
		_updateButtons = (playing) => {
			if(playing === undefined) {
				playing = !this.props.paused;
			} else {
				this.props.updateOption("paused", !playing);
			}
			
			if(playing) {
				this.props.addUniqueToArray(constants.keys.PLAYER_CLASS, this.stateClass.playing);
			} else {
				this.props.removeFromArrayByValue(constants.keys.PLAYER_CLASS, this.stateClass.playing);
			}
			if(!this.props.noFullWindow && this.props.fullWindow) {
				this.props.addUniqueToArray(constants.keys.PLAYER_CLASS, this.stateClass.fullScreen);
			} else {
				this.props.removeFromArrayByValue(constants.keys.PLAYER_CLASS, this.stateClass.fullScreen);
			}
			if(this.props.loop === "loop") {
				this.props.addUniqueToArray(constants.keys.PLAYER_CLASS, this.stateClass.looped);
			} else {
				this.props.removeFromArrayByValue(constants.keys.PLAYER_CLASS, this.stateClass.looped);
			}
		}
		_updateInterface = () => {
			this.setState({seekBarStyle: {width: `${this.props.seekPercent}%`}});

			this.props.smoothPlayBar ? this.setState({playBarStyle: {width: `${this.props.currentPercentAbsolute}%`}})
									: this.setState({playBarStyle: {width: `${this.props.currentPercentRelative}%`}});
			
			var currentTimeText = convertTime(this.props.currentTime);

			this.setState({currentTimeText: currentTimeText});

			var durationText = '',
				duration = this.props.duration,
				remaining = this.props.remaining;

			if(this.props.media.duration === 'string') {
				durationText = this.props.media.duration;
			} else {
				if(this.props.media.duration === 'number') {
					duration = this.props.media.duration;
					remaining = duration - this.props.currentTime;
				}
				if(this.props.remainingDuration) {
					durationText = (remaining > 0 ? '-' : '') + convertTime(remaining);
				} else {
					durationText = convertTime(duration);
				}
			}

			this.setState({durationText: durationText});
		}
		_seeking = () => {
			this.props.addUniqueToArray(constants.keys.SEEK_BAR_CLASS, constants.classNames.seeking);
			this.props.addUniqueToArray(constants.keys.PLAYER_CLASS, this.stateClass.seeking);
		}
		_seeked = () => {
			this.props.removeFromArrayByValue(constants.keys.SEEK_BAR_CLASS, constants.classNames.seeking);
			this.props.removeFromArrayByValue(constants.keys.PLAYER_CLASS, this.stateClass.seeking);
		}
		setMedia = (media) => {
			/*	media[format] = String: URL of format. Must contain all of the supplied option's video or audio formats.
			*	media.poster = String: Video poster URL.
			*	media.track = Array: Of objects defining the track element: kind, src, srclang, label, def.
			*	media.stream = Boolean: * NOT IMPLEMENTED * Designating actual media streams. ie., "false/undefined" for files.
			*/
			var	supported = false,
				posterChanged = this.props.media.poster !== media.poster; // Compare before reset. Important for OSX Safari as this.htmlElement.poster.src is absolute, even if original poster URL was relative.
				
			this._resetMedia();
						
			//Clear the Android Fix.
			this.androidFix.setMedia = false;
			this.androidFix.play = false;
			this.androidFix.pause = false;

			// Convert all media URLs to absolute URLs.
			media = util.absoluteMediaUrls(media);

			for (var formatPriority = 0; formatPriority < this.formats.length; formatPriority++) {
				var format = this.formats[formatPriority];
				var mediaType = util.format[format].media;
				var isVideo = mediaType === "video";

				if(this.props[mediaType].playableFormat[format] && util.validString(media[format])) { // Format supported in solution and url given for format.

				if(isVideo) {
					this._htmlSetVideo(media);
					this.props.updateOption("video", true);
					this.props.removeFromArrayByValue(constants.keys.VIDEO_PLAY_CLASS, constants.classNames.HIDDEN);
				} else {
					this._htmlSetAudio(media);

					// Setup the Android Fix - Only for HTML audio.
					if(constants.platform.android) {
						this.androidFix.setMedia = true;
					}
					this.props.updateOption("video", false);
					this.props.updateOption("media", media);
					this.props.addUniqueToArray(constants.keys.VIDEO_PLAY_CLASS, constants.classNames.HIDDEN);
				}
				supported = true;
				break;
				}
			}

			if(supported) {
				if(!(this.props.nativeVideoControls)) {
					// Set poster IMG if native video controls are not being used
					// Note: With IE the IMG onload event occurs immediately when cached.
					// Note: Poster hidden by default in _resetMedia()
					if(util.validString(media.poster)) {
						if(posterChanged) { // Since some constants.browsers do not generate img onload event.
							this.setState({posterSrc: media.poster});
						} else {
							this.props.removeFromArrayByValue(constants.keys.POSTER_CLASS, constants.classNames.HIDDEN);
						}
					}
				}

				if(typeof media.title === 'string') {
					this.setState({titleText: media.title});
				}
				
				this.props.updateOption("srcSet", true);
				this._updateButtons(false);
				this._trigger(this.props.onSetMedia);
			} else { // jPlayer cannot support any formats provided in this constants.browser
				// Send an error event
				this._error( {
					type: constants.errors.NO_SUPPORT,
					context: "{supplied:'" + this.props.supplied.join(", ") + "'}",
					message: constants.errorMessages.NO_SUPPORT,
					hint: constants.errorHints.NO_SUPPORT
				});
			}
		}
		_resetMedia = () => {
			this._updateButtons(false);
			this._updateInterface();
			this._seeked();
			this.props.addUniqueToArray(constants.keys.POSTER_CLASS, constants.classNames.HIDDEN);

			// Maintains the status properties that persist through a reset.
			//this.mergeOptions({status: defaultStatus});
			
			clearTimeout(this.internal.htmlDlyCmdId);

			this._htmlResetMedia();
		}
		clearMedia = () => {
			this._resetMedia();
			this._htmlClearMedia();
		}
		load = () => {
			if(this.props.srcSet) {
				this._htmlLoad();
			} else {
				this._urlNotSetError("load");
			}
		}
		focus = () => {
			if(this.props.keyEnabled) {
				util.focusInstance = this;
			}
		}
		play = (time) => {
			if(this.props.srcSet) {
				this.focus();
				this._htmlPlay(time);
			} else {
				this._urlNotSetError("play");
				this.props.updateOption("paused", true);
			}
		}
		pause = (time) => {
			if(this.props.srcSet) {
				this._htmlPause(time);
			} else {
				this._urlNotSetError("pause");
			}
		}
		stop = () => {
			if(this.props.srcSet) {
				this._htmlPause(0);
			} else {
				this._urlNotSetError("stop");
			}
		}
		playHead = (p) => {
			p = util.limitValue(p, 0, 100);
			if(this.props.srcSet) {
				this._htmlPlayHead(p);
			} else {
				this._urlNotSetError("playHead");
			}
		}
		mute = (mute) => {					
			if(this.props.muted) {
				this.props.updateOption("muted", false);
			} else {
				mute = mute === undefined ? true : !!mute;
				this.props.updateOption("muted", mute);
			}
		}
		_updateMute = (mute) => {
			if(mute === undefined) {
				mute = this.props.muted;
			}
			if(mute) {
				this.props.addUniqueToArray(constants.keys.PLAYER_CLASS, this.stateClass.muted);
			} else {
				this.props.removeFromArrayByValue(constants.keys.PLAYER_CLASS, this.stateClass.muted);
			}	
		}
		_updateVolume = (v) => {
			v = util.limitValue(v, 0, 1);
			if(v === undefined) {
				v = this.props.volume;
			}
			v = this.props.muted ? 0 : v;

			if(this.props.noVolume) {
				this.props.addUniqueToArray(constants.keys.PLAYER_CLASS, this.stateClass.noVolume);
				this.props.addUniqueToArray(constants.keys.VOLUME_BAR_CLASS, constants.classNames.HIDDEN);
				this.props.addUniqueToArray(constants.keys.VOLUME_BAR_VALUE_CLASS, constants.classNames.HIDDEN);
				this.props.addUniqueToArray(constants.keys.VOLUME_MAX_CLASS, constants.classNames.HIDDEN);
			} else {
				this.props.removeFromArrayByValue(constants.keys.PLAYER_CLASS, this.stateClass.noVolume);
				const volumeValue = (v * 100) + "%";

				this.setState({volumeBarValueStyle: {
					width: !this.props.verticalVolume ? volumeValue : null,
					height: this.props.verticalVolume ? volumeValue : null
				}});

				this.props.removeFromArrayByValue(constants.keys.VOLUME_BAR_CLASS, constants.classNames.HIDDEN);
				this.props.removeFromArrayByValue(constants.keys.VOLUME_BAR_VALUE_CLASS, constants.classNames.HIDDEN);
				this.props.removeFromArrayByValue(constants.keys.VOLUME_MAX_CLASS, constants.classNames.HIDDEN);
			}
		}
		_cssSelectorAncestor = (ancestor) => {
			this.props.removeFromArrayByValue(constants.keys.PLAYER_CLASS, this.props.cssClass);
			this.props.addUniqueToArray(constants.keys.PLAYER_CLASS, this.props.cssClass);
								
			// Set the GUI to the current state.
			this._updateInterface();
			this._updateButtons();
			this._updateVolume();
			this._updateMute();
		}
		duration = (e) => {
			if(this.props.toggleDuration) {
				if(this.props.captureDuration) {
					e.stopPropagation();
				}
				this.props.updateOption("remainingDuration", !this.props.remainingDuration);
			}
		}
		_updatePlaybackRate = () => {
			var pbr = this.props.playbackRate,
				ratio = (pbr - this.props.minPlaybackRate) / (this.props.maxPlaybackRate - this.props.minPlaybackRate);
			if(this.props.playbackRateEnabled) {
				this.props.removeFromArrayByValue(constants.keys.PLAYBACK_RATE_BAR_CLASS, constants.classNames.HIDDEN);
				this.props.removeFromArrayByValue(constants.keys.PLAYBACK_RATE_BAR_VALUE_CLASS, constants.classNames.HIDDEN);

				const playbackRateBarValue = (ratio*100)+"%";

				this.setState({playbackRateBarValueStyle: {
					width: !this.props.verticalPlaybackRate ? playbackRateBarValue : null,
					height: this.props.verticalPlaybackRate ? playbackRateBarValue : null
				}});
			} else {
				this.props.addUniqueToArray(constants.keys.PLAYBACK_RATE_BAR_CLASS, constants.classNames.HIDDEN);
				this.props.addUniqueToArray(constants.keys.PLAYBACK_RATE_BAR_VALUE_CLASS, constants.classNames.HIDDEN);
			}
		}
		incrementCurrentLoop = () => {
			var loopIndex = this.loopOptions.indexOf(this.props.loop || this.loopOptions[0]);

			if (loopIndex >= this.loopOptions.length - 1) {
				loopIndex = -1;
			}
			return this.loopOptions[++loopIndex];
		}
		_loop = () => {
			this._updateButtons(); 
			this._trigger(this.props.onRepeat);
		}
		_updateSize = () => {
			// Video html resized if necessary at this time, or if native video controls being used.
			if(!this.props.waitForPlay && this.props.video
					|| this.props.video.available && this.props.nativeVideoControls) {
				this.setState({videoStyle: {
					width: !this.props.width,
					height: this.props.height
				}});
			}
		}
		fullScreen = () => {
			var wkv = util.nativeFeatures.fullscreen.used.webkitVideo;
			if(!wkv || wkv && !this.props.waitForPlay) {
				if(this.props.fullScreen) {
					this._requestFullscreen();
				} else {
					this._exitFullscreen();
				}
				if(!wkv) {
					this.props.updateOption("fullWindow", this.props.fullScreen);
				}
			}
		}
		fullWindow = () => {
			const sizeClass = this.props.fullWindow ? this.props.sizeFullCssClass : this.props.sizeCssClass;
			this.props.removeFromArrayByValue(constants.keys.PLAYER_CLASS, this.props.cssClass);
			this.props.addUniqueToArray(constants.keys.PLAYER_CLASS, this.stateClass[sizeClass]);
			//this.props.updateOption("cssClass", sizeClass, () => this._trigger(this.props.onResize));		
		}
		_requestFullscreen = () => {
			var e = document.querySelector(this.props.cssSelectorAncestor),
				fs = util.nativeFeatures.fullscreen;

			// This method needs the video element. For iOS and Android.
			if(fs.used.webkitVideo) {
				e = this.currentMedia;
			}

			if(fs.api.fullscreenEnabled) {
				fs.api.requestFullscreen(e);
			}
		}
		_exitFullscreen = () => {
			var fs = util.nativeFeatures.fullscreen,
				e;

			// This method needs the video element. For iOS and Android.
			if(fs.used.webkitVideo) {
				e = this.video.element();
			}

			if(fs.api.fullscreenEnabled) {
				fs.api.exitFullscreen(e);
			}
		}
		_htmlInitMedia = (media) => {
			var mediaArray = media.track || [];
			var tracks = [];

			// Create any track elements given with the media, as an Array of track Objects.
			for (var index = 0; index < mediaArray.length; index++) {
				var v = array[index];
				var vDef = undefined

				if(v.def) {
					vDef = v.def;
				}

				trackElements.push(<track kind={v.Kind} src={v.src} srclang={v.srclang} label={v.label} default={vDef}/>);
			}

			this.setState({tracks: tracks});
			this.currentMedia.src = this.props.src;

			if(this.props.preload !== 'none') {
				this._htmlLoad();
				this._trigger(this.props.onTimeUpdate)
			}
		}
		_htmlSetFormat = (media) => {
			// Always finds a format due to checks in setMedia()
			for (var priority = 0; priority < this.formats.length; priority++) {
				var format = this.formats[priority];
				var mediaType = util.format[format].media;

				if(this.props[mediaType].playableFormat[format] && media[format]) {
					this.props.updateOption("src", media[format]);
					this.props.updateOption("formatType", format);
					this.props.updateOption("format", {[format]: true});
					break;
				}
			}
		}
		_htmlSetAudio = (media) => this._htmlSetFormat(media)
		_htmlSetVideo = (media) => {
			this._htmlSetFormat(media);
			if(this.props.nativeVideoControls) {
				this.video.element().poster = util.validString(media.poster) ? media.poster : "";
			}
		}
		_htmlResetMedia = () => {
			if(this.currentMedia) {
				if(!this.props.nativeVideoControls) {
					this.props.addUniqueToArray(constants.keys.VIDEO_CLASS, constants.classNames.HIDDEN);
				}
				this.currentMedia.pause();
			}
		}
		_htmlClearMedia = () => {
			if(this.currentMedia) {
				this.currentMedia.src = "about:blank";

				// The following load() is only required for Firefox 3.6 (PowerMacs).
				// Recent HTMl5 constants.browsers only require the src change. Due to changes in W3C spec and load() effect.
				this.currentMedia.load(); // Stops an old, "in progress" download from continuing the download. Triggers the loadstart, error and emptied events, due to the empty src. Also an abort event if a download was in progress.
			}
		}
		_htmlLoad = (htmlLoadedCallback) => {
			// This function remains to allow the early HTML5 constants.browsers to work, such as Firefox 3.6
			// A change in the W3C spec for the media.load() command means that this is no longer necessary.
			// This command should be removed and actually causes minor undesirable effects on some constants.browsers. Such as loading the whole file and not only the metadata.
			if(this.props.waitForLoad) {
				this.currentMedia.load();
				this.props.updateOption("waitForLoad", false);
			}
			clearTimeout(this.internal.htmlDlyCmdId);
		}
		_htmlPlay = (time) => {
			this.androidFix.pause = false; // Cancel the pause fix.

			this._htmlLoad(); // Loads if required and clears any delayed commands.

			// Setup the Android Fix.
			if(this.androidFix.setMedia) {
				this.androidFix.play = true;
				this.androidFix.time = time;
			} else if(!isNaN(time)) {
				// Attempt to play it, since iOS has been ignoring commands
				if(this.internal.cmdsIgnored) {
					this.currentMedia.play();
				}
				try {
					// !this.currentMedia.seekable is for old HTML5 constants.browsers, like Firefox 3.6.
					// Checking seekable.length is important for iOS6 to work with setMedia().play(time)
					if(!this.currentMedia.seekable || typeof this.currentMedia.seekable === "object" && this.currentMedia.seekable.length > 0) {
						this.currentMedia.currentTime = time;
						this.currentMedia.play();
					} else {
						throw 1;
					}
				} catch(err) {
					this.internal.htmlDlyCmdId = setTimeout(() => {
						this.props.updateOption("paused", false);
						this.props.updateOption("currentTime", time);
					}, 250);
					return; // Cancel execution and wait for the delayed command.
				}
			} else {
				this.currentMedia.play();
			}
		}
		_htmlPause = (time) => {
			this.androidFix.play = false; // Cancel the play fix.

			if(time > 0) { // We do not want the stop() command, which does pause(0), causing a load operation.
				this._htmlLoad();
			} else {
				clearTimeout(this.internal.htmlDlyCmdId);
			}

			// Order of these commands is important for Safari (Win) and IE9. Pause then change currentTime.
			this.currentMedia.pause();

			// Setup the Android Fix.
			if(this.androidFix.setMedia) {
				this.androidFix.pause = true;
				this.androidFix.time = time;

			} else if(!isNaN(time)) {
				try {
					if(!this.currentMedia.seekable || typeof this.currentMedia.seekable === "object" && this.currentMedia.seekable.length > 0) {
						this.currentMedia.currentTime = time;
					} else {
						throw 1;
					}
				} catch(err) {
					this.internal.htmlDlyCmdId = setTimeout(() => {
						this.props.updateOption("paused", true);
						this.props.updateOption("currentTime", time);
					}, 250);
					return; // Cancel execution and wait for the delayed command.
				}
			}
		}
		_htmlPlayHead = (percent) => {
			this._htmlLoad();

			// This playHead() method needs a refactor to apply the android fix.
			try {
				if(typeof this.currentMedia.seekable === "object" && this.currentMedia.seekable.length > 0) {
					this.currentMedia.currentTime = percent * this.currentMedia.seekable.end(this.currentMedia.seekable.length-1) / 100;
				} else if(this.currentMedia.duration > 0 && !isNaN(this.currentMedia.duration)) {
					this.currentMedia.currentTime = percent * this.currentMedia.duration / 100;
				} else {
					throw "e";
				}
			} catch(err) {
				this.internal.htmlDlyCmdId = setTimeout(() => {
					this.playHead(percent);
				}, 250);
				return; // Cancel execution and wait for the delayed command.
			}
		}
		_htmlCheckWaitForPlay = () => {
			if(this.props.waitForPlay) {
				this.props.updateOption("waitForPlay", false);
				this.props.addUniqueToArray(constants.keys.VIDEO_PLAY_CLASS, constants.classNames.HIDDEN);

				if(this.props.video) {
					this.props.addUniqueToArray(constants.keys.POSTER_CLASS, constants.classNames.HIDDEN);
					this.setState({videoStyle: {
						width: this.props.width,
						height: this.props.height
					}});
				}
			}
		}
		_urlNotSetError = (context) => {
			this._error({
				type: constants.errors.URL_NOT_SET,
				context: context,
				message: constants.errorMessages.URL_NOT_SET,
				hint: constants.errorHints.URL_NOT_SET
			});
		}
		_error = (error) => {
			this._trigger(this.props.onError, error);
		}
		updateOnOptionsChanged = (key) => {
			switch (key) {
				case "media":
					this.setMedia(this.props.media);
					break;
				case "paused":
					this.props.paused ? this.pause(this.props.currentTime) : this.play(this.props.currentTime);
					break;
				case "loop":
					this._loop();
					break;
				case "fullScreen":
					this.fullScreen();
					break;
				case "fullWindow":
					this.fullWindow();
					break;
				case "noVolume":
					this._updateVolume();
					this._updateMute();
					this.props.updateOption("noVolume", util.uaBlocklist(this.props.noVolume));
					break;
				case "keyEnabled":
					if(!value && this === util.focusInstance) {
						util.focusInstance = null;
					}
					break;
				case "nativeVideoControls":
					this._updateNativeVideoControls();
					break;
				case "defaultPlaybackRate":
				case "playbackRate":
				case "minPlaybackRate":
				case "maxPlaybackRate":
					this._updatePlaybackRate();
					break;
				case "currentTime":
				case "duration":
				case "remainingDuration":
					this._updateInterface();
					break;
				case "paused":
				case "noFullWindow":
				case "loop":
				case "sizeCssClass":
				case "sizeFullCssClass":
				case "fullWindow":
				case "fullScreen":
					this._updateButtons();
					break;
				case "src":
					this._htmlInitMedia(this.props.media);
					break;
				case "waitForLoad":
				//if(time > 0) { // Avoids a setMedia() followed by stop() or pause(0) hiding the video play button.
					this._htmlCheckWaitForPlay();
				//}
					break;
				default:
					break;
			}	
		}
		extendMethod = (methodName, newMethod) => {
			this[methodName].apply(this, arguments);
			newMethod(this[methodName]);
		}
		componentWillMount() {
			// for (var method in this.props.overrideMethods) {
			// 	const newMethod = this.props.overrideMethods[method];
			// 	const oldMethod = this[method];

			// 	if (oldMethod !== undefined) {
			// 		newMethod(oldMethod);
			// 	}
			// }
			
			this._initBeforeRender();
		}
		componentDidMount() {
			this._initAfterRender();	
		}
		componentDidUpdate(prevProps, prevState) {

			// for (var key in this.props) {
			// 	const prop = this.props[key];

			// 	if (!isEqual(prop, prevProps[key])) {
			// 		updateOnOptionsChanged(key);
			// 	}
			// }
		}
		render() {
			return (
				<WrappedComponent setMedia={this.setMedia} clearMedia={this.clearMedia} load={this.load} play={this.play} pause={this.pause} 
					stop={this.stop} playHead={this.playHead} focus={this.focus} volume={this.volume} mute={this.mute} unmute={this.unmute}			
					{...this.props} extendMethod={this.extendMethod}>
				</WrappedComponent>					
			);
		}
	}
)
