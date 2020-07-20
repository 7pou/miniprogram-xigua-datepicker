Page({
  data: {
    date_1: '',
    date_2: '',
    date_3: '',
    date_4: ['2020-04-24 00:00', '2020-07-20 16:27'],
    date_5: '',
    date_6: '',
    date_7: '',
  },

  // 选择日期
  handleOpen_1() {
    this.selectComponent('#date').open({
      value: this.data.date_1,
      range: false,
      showTime: false,
      onChange: res => {
        this.setData({date_1: res})
      }
    })
  },

  // 选择日期(带有时间)
  handleOpen_2() {
    this.selectComponent('#date').open({
      value: this.data.date_2,
      range: false,
      onChange: res => {
        this.setData({date_2: res})
      }
    })
  },

  // 选择日期区间
  handleOpen_3() {
    this.selectComponent('#date').open({
      value: this.data.date_3,
      showTime: false,
      onChange: res => {
        this.setData({date_3: res})
      }
    })
  },
  // 选择日期区间(带有时间)
  handleOpen_4() {
    this.selectComponent('#date').open({
      value: this.data.date_4,
      onChange: res => {
        this.setData({date_4: res})
      }
    })
  },

  // 选择日期(自定义标题)
  handleOpen_5() {
    this.selectComponent('#date').open({
      value: this.data.date_5,
      range: false,
      showTime: false,
      title: '自定义的标题',
      onChange: res => {
        this.setData({date_5: res})
      }
    })
  },

  // 选择日期(自定义按钮色)
  handleOpen_6() {
    this.selectComponent('#date').open({
      value: this.data.date_6,
      range: false,
      showTime: false,
      confirmColor: '#36c140',
      onChange: res => {
        this.setData({date_6: res})
      }
    })
  },

  // 选择日期(自定义确定Hook)
  handleOpen_7() {
    this.selectComponent('#date').open({
      value: this.data.date_7,
      range: false,
      showTime: false,
      beforeHook: (e) => {
        if (e !== '2008-08-08') {
          wx.showToast({title: '请选择2008年8月8号', icon: 'none'})
          return false
        }
        return true
      },
      onChange: res => {
        this.setData({date_7: res})
      }
    })
  },
})
