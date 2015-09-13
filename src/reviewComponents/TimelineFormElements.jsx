import React from 'react'
import TimelineUtil from '../collectiveExperience/timelineUtilities.js'

export class AbstractTimelineSlider extends React.Component {
  onChange(){
    var trackData = this.trackForValue()
    if (!trackData.window) trackData.window = this.props.window
    // console.log('setting track', this.props.for, trackData)
    this.props.cx.setTrack(this.props.for, trackData)
  }

  track(){
    var t = this.props.cx.getTrack(this.props.for)
    console.log('got track', this.props.for, t)
    return t
  }

  render(){
    return <li className="table-view-cell">
      <p>{this.props.text}</p>
      <input ref="input" type="range"
        onChange={this.onChange.bind(this)}
        value={this.currentValue()}
        max={this.max()}
      />
      <div>{this.desc()}</div>
    </li>
  }
}

export class HowOftenSlider extends AbstractTimelineSlider {
  trackForValue(){
    var el = React.findDOMNode(this.refs.input)
    return { regular: { seconds: Number(el.value), every: 604800 } }
  }

  currentValue(){
    var t = this.track()
    return t.regular ? t.regular.seconds : 0
  }

  desc(){
    var hrspwk = Math.floor(this.currentValue() / 60 / 60)
    return `${hrspwk} h/wk`
  }

  max(){
    var { during } = this.props
    var median = during && TimelineUtil.getMedianSecondsPerWeek(during)
    return median || 352800
  }
}

export class HowManyTimesSlider extends AbstractTimelineSlider {
  trackForValue(){
    var el = React.findDOMNode(this.refs.input)
    return { occurrencesCount: Number(el.value) }
  }

  currentValue(){
    var t = this.track()
    return t.occurrencesCount || 0
  }

  desc(){
    return `${this.currentValue()} times`
  }

  max(){
    return 20
  }
}

export class WhenDidYouFirstSlider extends AbstractTimelineSlider {
  trackForValue(){
    var { window } = this.props
    var el = React.findDOMNode(this.refs.input)
    var t = Number(el.value) + window[0]
    return { occurrences: [t] }
  }

  currentValue(){
    var { window } = this.props
    var track = this.track()
    var t = track.occurrences ? track.occurrences[0] : 0
    return t - window[0]
  }

  desc(){
    var { window } = this.props
    var t0 = window && window[0] || 0
    var weeks = Math.floor(this.currentValue() / 604800)
    return `after ${weeks} weeks`
  }

  max(){
    var { window } = this.props
    if (window) return window[1] - window[0]
    else return 604800 * 52
  }
}







// export class AreYouNowToggle extends AbstractTimelineSlider {
//   currentValue(){
//     var x = this.props.cx.getCurrentValue(this.props.for)
//     if (this.props.reversed) return x == -1;
//     else return x
//   }
//
//   onToggle(){
//     var { cx } = this.props
//     var t = cx.getTrack(this.props.for)
//     var v = TimelineUtil.currentValue(t)
//     if (this.props.window) v.window = this.props.window
//
//     if (this.props.reversed){
//       if (v == 0) cx.setTrack(this.props.for, cx.Timelines.updateValue(t, -1))
//       if (v == -1) cx.setTrack(this.props.for, cx.Timelines.updateValue(t, 0))
//     } else {
//       if (v == 0) cx.setTrack(this.props.for, cx.Timelines.updateValue(t, 1))
//       if (v == 1) cx.setTrack(this.props.for, cx.Timelines.updateValue(t, 0))
//     }
//   }
//
//   render(){
//     return <li className="table-view-cell" onClick={this.onToggle.bind(this)}>
//       {this.props.text}
//       <div className={`toggle ${this.currentValue() && 'active'}`}>
//         <div className="toggle-handle"></div>
//       </div>
//     </li>
//   }
// }
