import Vue from "vue"

import pullLoadStatus from "./status"

import PullLoadTips from "./PullLoadTips"

import bezierEasing from "bezier-easing"

const easing = bezierEasing(0.250, 0.100, 0.250, 1.000)

// const easeOut = bezierEasing(0, 0, 0.58, 1)

// const easeIn = bezierEasing(0.42, 0, 1, 1)

const inserted = (el, binding) => {
  let tipsInstance = el.pullLoadTips
  if (!tipsInstance) {
    const Tips = Vue.extend(PullLoadTips)
    tipsInstance = el.pullLoadTips = new Tips({
      el: document.createElement("div")
    })
    el.prepend(el.pullLoadTips.$el)
    el.classList.add("vue-pull-load")
  }

  const options = Object.assign({
    loadHandler: binding.value || (() => Promise.resolve()),
    bindToWrapper: false
  }, binding.value)

  const scrollingElement = options.bindToWrapper ? el.parentNode : document.scrollingElement

  const tipsEl = tipsInstance.$el
  const tipsHeight = tipsEl.clientHeight
  const state = {
    useTransform: true,
    enabled: true,
    touching: false,
    bouncing: false,
    bounceTime: 600,
    y: 0,
    minY: 0,
    status: pullLoadStatus.ready,
    distance: tipsHeight
  }
  const helpers = {
    bounceTimer: null,
    tempState: {
      startY: 0,
      lastY: 0,
      y: 0,
      s: 0
    },
    handles: {},
    addEvent (name, handle) {
      if (!this.handles[name]) {
        this.handles[name] = []
      }
      this.handles[name].push(handle)
      el.addEventListener(name, handle)
    },
    removeEvent (name, handle) {
      if (!name) {
        Object.keys(this.handles).forEach((name) => {
          this.removeEvent(name)
        })
        return
      }
      if (!this.handles[name]) return
      if (!handle) {
        this.handles[name].forEach(h => {
          el.removeEventListener(name, h)
        })
        this.handles[name] = []
      } else {
        el.removeEventListener(name, handle)
        const index = this.handles[name].findIndex(h => h === handle)
        this.handles[name].splice(index, 1)
      }
    },

    setTimer (callback) {
      this.bounceTimer = window.requestAnimationFrame(callback)
    },

    bounce () {
      if (state.y === state.minY) {
        return
      }
      state.bouncing = true
      const len = state.minY - state.y
      const y = state.y
      let timeStart = 0
      const _bounce = (oldTime) => {
        this.setTimer((time) => {
          if (oldTime) {
            let percent = (time - timeStart) / state.bounceTime
            if (percent > 1) percent = 1
            this.translateTo(y + easing(percent) * len)
            if (percent === 1) {
              this.stopBounce()
              return
            }
          } else {
            timeStart = time
          }
          _bounce(time)
        })
      }

      _bounce()
    },

    stopBounce () {
      state.bouncing = false
      if (this.bounceTimer) {
        window.cancelAnimationFrame(this.bounceTimer)
        this.bounceTimer = null
      }
    },

    initEvent () {
      this.removeEvent()
      this.addEvent("touchstart", e => {
        state.touching = true
        this.stopBounce()
        this.tempState.y = e.targetTouches[0].screenY
      })
      this.addEvent("touchmove", e => {
        if (!state.enabled) return
        if (scrollingElement.scrollTop > 0) return
        if (state.touching) {
          this.tempState.lastY = this.tempState.y
          this.tempState.y = e.targetTouches[0].screenY
          this.tempState.s = this.tempState.y - this.tempState.lastY
          if (this.tempState.s > 0 || state.y > 0) {
            e.preventDefault()
            let len = this.tempState.s / 3
            if (state.y + len < 0) {
              len = 0 - state.y
            }
            this.translate(len)
            this.setPullingStatus()
          }
        }
      })
      this.addEvent("touchend", e => {
        state.touching = false
        this.setLoadingStatus()
        this.bounce()
      })
    },

    translateTo (y) { // 滚动到y
      state.y = y
      if (state.useTransform) {
        el.style.webkitTransform = `translateZ(0) translateY(${y}px)`
        el.style.transform = `translateZ(0) translateY(${y}px)`
      } else {
        el.style.marginTop = `${y}px`
      }
    },

    translate (len = 0) { // 滚动内容
      this.translateTo(state.y + len)
    },

    setStatus (status) {
      state.status = status
      tipsInstance.status = status
    },

    setPullingStatus () {
      if (state.status !== pullLoadStatus.loading) {
        if (state.y >= state.distance) {
          this.setStatus(pullLoadStatus.pre)
        } else {
          this.setStatus(pullLoadStatus.ready)
        }
      }
    },

    setLoadingStatus () {
      if (state.status === pullLoadStatus.pre) {
        this.setStatus(pullLoadStatus.loading)
        state.minY = state.distance
        state.enabled = false
        this.load().then(() => {
          this.stopBounce()
          this.setStatus(pullLoadStatus.done)
          state.minY = 0
          state.enabled = true
          this.bounce()
        }).catch(() => {
          this.setStatus(pullLoadStatus.error)
          state.enabled = true
        })
      }
    },

    load () {
      return options.loadHandler()
    }
  }

  helpers.initEvent()

  el.helpers = helpers
}

const unbind = (el, binding) => {
  el.helpers.removeEvent()
}

export default {
  name: "pull-load",
  inserted,
  unbind
}
