
const createNum = (num, weight = 0) => {
  const result = []
  while (result.length < num) {
    result.push(result.length + weight)
  }
  return result
}

Component({
  data: {
    show: false,
    start: {
      currentDate: '',
      currentIndex: [],
      years: [],
      months: createNum(12, 1),
      days: createNum(31, 1),
      hours: createNum(24),
      minutes: createNum(60),
    },
    end: {
      currentDate: '',
      currentIndex: [],
      years: [],
      months: createNum(12, 1),
      days: createNum(31, 1),
      hours: createNum(24),
      minutes: createNum(60),
    }
  },


  methods: {

    open(opts = {}) {
      const defaultOpts = this._getDefaultOpts(opts)
      this.opts = Object.assign(defaultOpts, opts)
      if (this.data.start.years.length === 0) {
        this.createColumnYeays()
      }

      this.setViewDataFromOpts(this.opts)
      this.setValue(opts.value)
      this.setData({show: true})
    },
    setViewDataFromOpts(option) {
      this.setData({
        title: option.title,
        zIndex: option.zIndex,
        confirmColor: option.confirmColor,
        showTime: option.showTime,
        range: option.range,
      })
    },
    setValue(value) {
      value = value || [this._getFormatDate(null, true), this._getFormatDate(null, true)]
      if (typeof (value) === 'string') {
        value = [value]
      }

      const startDate = this._moment(value[0])


      const startYearIndex = this.data.start.years.findIndex(e => e === startDate.getFullYear())
      const startMonthIndex = this.data.start.months.findIndex(e => e === startDate.getMonth() + 1)
      const staryDayIndex = this.data.start.days.findIndex(e => e === startDate.getDate())
      const startHourIndex = this.data.start.hours.findIndex(e => e === startDate.getHours())
      const startMinuteIndex = this.data.start.minutes.findIndex(e => e === startDate.getMinutes())


      const endDate = value[1] ? this._moment(value[1]) : new Date()

      const endYearIndex = this.data.end.years.findIndex(e => e === endDate.getFullYear())
      const endMonthIndex = this.data.end.months.findIndex(e => e === endDate.getMonth() + 1)
      const endDayIndex = this.data.end.days.findIndex(e => e === endDate.getDate())
      const endHourIndex = this.data.end.hours.findIndex(e => e === endDate.getHours())
      const endtMinuteIndex = this.data.end.minutes.findIndex(e => e === endDate.getMinutes())


      wx.nextTick(() => {
        this.setData({
          start: Object.assign(this.data.start, {
            currentDate: this._getFormatDate(startDate, this.data.showTime),
            currentIndex: [
              startYearIndex, startMonthIndex, staryDayIndex, startHourIndex, startMinuteIndex
            ],
            days: this.createColumnDays(startDate.getMonth() + 1)
          }),
          end: Object.assign(this.data.end, {
            currentDate: this._getFormatDate(endDate, this.data.showTime),
            currentIndex: [endYearIndex, endMonthIndex, endDayIndex, endHourIndex, endtMinuteIndex],
            days: this.createColumnDays(endDate.getMonth() + 1)
          })
        })
      })
    },
    handleConfirm() {
      const data = this.getSubmitData()
      if (!this.opts.beforeHook(data)) return

      this.setData({show: false})
      this.opts.onChange(data)
    },
    handleCancel() {
      this.setData({show: false})
      this.opts.onCancel()
    },
    createColumnYeays() {
      const currentYear = new Date().getFullYear()
      const years = [currentYear]
      for (let i = 0; i < 100; i++) {
        years.unshift(currentYear - i - 1)
        years.push(currentYear + i + 1)
      }

      this.data.start.years = years
      this.data.end.years = years
      this.setData({
        start: this.data.start,
        end: this.data.end
      })
    },
    createColumnDays(month) { // ---创建天
      let maxDay = 31
      if (month === 2) {
        if (this.isRunNian()) {
          maxDay = 29
        } else {
          maxDay = 28
        }
      } else if ([4, 6, 9, 11].indexOf(month) > -1) {
        maxDay = 30
      }
      return createNum(maxDay, 1)
    },
    isRunNian() { // ---返回是否闰年
      const currentYear = new Date().getFullYear
      if (currentYear % 400 === 0) {
        return true
      }
      if (currentYear % 100 !== 0 && currentYear % 4 === 0) {
        return true
      }
      return false
    },
    handleStartChange(ev) { // ---监听开始时间改变
      const index = ev.detail.value
      const {start} = this.data


      // 是否正常范围,不正常需要把当前值改为正常
      if (!this._isValidDate(ev, 'start') && this.data.range) {
        wx.showToast({
          title: '截止时间不能小于开始时间',
          icon: 'none'
        })
        this.setData({start: this.data.start})
        return
      }


      // 判断是否滚动了年或月 , 是的话需要重新生成日
      if (
        this.data.start.currentIndex[0] !== index[0] ||
        this.data.start.currentIndex[1] !== index[1]
      ) {
        const month = this.data.start.months[index[1]]
        const days = this.createColumnDays(month)
        start.days = days
      }
      // 赋值当前的日期和下标
      start.currentIndex = index
      start.currentDate = start.years[index[0]] +
                                '-' +
                                this._padStart(start.months[index[1]], 2, '0') +
                                '-' +
                                this._padStart(start.days[index[2]], 2, '0') +
                                (this.data.showTime
                                  ? (
                                    ' ' +
                                  this._padStart(start.hours[index[3]], 2, '0') +
                                  ':' +
                                  this._padStart(start.minutes[index[4]], 2, '0')
                                  )
                                  : ''
                                )
      this.setData({start})
      this.opts.onScroll('start', this.getSubmitData())
    },
    getSubmitData() {
      // let start = null
      // let end = null

      if (this.data.range) {
        return [this.data.start.currentDate, this.data.end.currentDate]
      } else {
        return this.data.start.currentDate
      }
    },

    handleEndChange(ev) { // ---监听结束时间改变
      const index = ev.detail.value
      const {end} = this.data

      // 是否正常范围,不正常需要把当前值改为正常
      if (!this._isValidDate(ev, 'end') && this.data.range) {
        wx.showToast({
          title: '截止时间不能小于开始时间',
          icon: 'none'
        })
        this.setData({end: this.data.end})
        return
      }

      if (
        this.data.end.currentIndex[0] !== index[0] ||
        this.data.end.currentIndex[1] !== index[1]
      ) {
        const month = this.data.end.months[index[1]]
        const days = this.createColumnDays(month)
        end.days = days
      }

      this.data.end.currentIndex = index
      this.data.end.currentDate = end.years[index[0]] +
                                        '-' +
                                        this._padStart(end.months[index[1]], 2, '0') +
                                        '-' +
                                        this._padStart(end.days[index[2]], 2, '0') +
                                       (
                                         this.data.showTime
                                           ? (
                                             ' ' +
                                          this._padStart(end.hours[index[3] || 0], 2, '0') +
                                          ':' +
                                          this._padStart(end.minutes[index[4] || 0], 2, '0')
                                           )
                                           : ''
                                       )
      this.setData({end})
      this.opts.onScroll('end', this.getSubmitData())
    },
    _moment(time) {
      if (typeof (time) === 'number' || typeof (time) === 'object') {
        return new Date(time)
      }
      if (typeof (time) === 'string') {
        if (time.length === 13) {
          time = parseFloat(time)
          return new Date(time)
        }
        time = time.replace(/-/g, ':').replace(' ', ':')
        time = time.replace(/\//g, ':').replace(' ', ':')
        time = time.split(':')
        for (let i = time.length; i < 6; i += 1) {
          time.push('0')
        }

        return new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5])
      }
      return new Error('请检查time的数据格式')
    },
    _padStart(val, length, fillString) {
      if (val === undefined) {
        return null
      }
      val += ''
      while (val.length < length) {
        val = fillString + val
      }
      return val
    },
    _isValidDate(ev, type) { // ---对比时间范围是否正常
      const currentIndex = ev.detail.value
      if (type === 'start') {
        const oldEndIndex = this.data.end.currentIndex
        let result = true
        for (let i = 0; i < currentIndex.length; i++) {
          if (currentIndex[i] > oldEndIndex[i]) {
            result = false
            break
          }
          if (currentIndex[i] < oldEndIndex[i]) {
            break
          }
        }
        return result
      } else {
        const oldStartIndex = this.data.start.currentIndex
        let result = true
        for (let i = 0; i < currentIndex.length; i++) {
          if (oldStartIndex[i] > currentIndex[i]) {
            result = false
            break
          }
          if (oldStartIndex[i] < currentIndex[i]) {
            break
          }
        }
        return result
      }
    },


    _getFormatDate(date, showTime) { // --- 格式化日期
      date = date || new Date()
      const year = date.getFullYear()
      const month = this._padStart(date.getMonth() + 1, 2, '0')
      const day = this._padStart(date.getDate(), 2, '0')
      const hour = this._padStart(date.getHours(), 2, '0')
      const minute = this._padStart(date.getMinutes(), 2, '0')
      return year + '-' + month + '-' + day + (showTime ? (' ' + hour + ':' + minute) : '')
    },

    _getDefaultOpts() { // --- 默认的参数配置
      return {

        title: '选择日期',
        range: true,
        showTime: true,
        zIndex: 1,
        confirmColor: '#e74845',
        beforeHook: () => true,
        onChange: () => {
          console.warn('未传入日期监听函数')
        },
        onScroll: () => {},
        onCancel: () => {}
      }
    },
  }
})
