<template>
  <div v-if="isShow">
    <button class="btn" data-clipboard-target="#CTable" @click="copy">copy table</button>
    <table id="CTable" style="border-collapse: collapse; margin-top: 1em; margin-bottom: 1em">
      <thead>
        <tr>
          <td colspan="4" style="text-align: left">
            <div
              align="center"
              style="color: #000; font-weight: 600; font-size: 18px; padding: 8px 8px 8px"
            >
              俄文为
            </div>
          </td>
        </tr>
        <tr>
          <th
            style="
              color: #112055;
              border-bottom: 1px solid #000;
              border-top: 2px solid #000;
              text-align: center;
            "
          >
            变量
          </th>
          <th
            style="
              color: #112055;
              border-bottom: 1px solid #000;
              border-top: 2px solid #000;
              text-align: center;
            "
          >
            俄文我
          </th>
          <th
            style="
              color: #112055;
              border-bottom: 1px solid #000;
              border-top: 2px solid #000;
              text-align: center;
            "
          >
            俄文我
          </th>
          <th
            style="
              color: #112055;
              border-bottom: 1px solid #000;
              border-top: 2px solid #000;
              text-align: center;
            "
          >
            看i额外为i俄u我
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            colspan="4"
            style="padding: 5px 50px 5px; color: #000; font-weight: 900; text-align: left"
          >
            诶诶我
          </td>
        </tr>
        <tr>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">1</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">626</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">7622234</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">762234</td>
        </tr>
        <tr>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">2</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">174</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">2122222</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">972256</td>
        </tr>
        <tr>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">0</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">20</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">22224</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">100</td>
        </tr>
        <tr>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">Total</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">820</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">100</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">100</td>
        </tr>
        <tr>
          <td
            colspan="4"
            style="
              padding: 5px 50px 5px;
              color: #000;
              font-weight: 900;
              text-align: left;
              border-top: 1px solid #bebebe;
            "
          >
            反间谍法
          </td>
        </tr>
        <tr>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">0</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">649</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">792215</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">792215</td>
        </tr>
        <tr>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">1</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">171</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">2022285</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">100</td>
        </tr>
        <tr>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">Total</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">82220</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">10220</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">10220</td>
        </tr>
        <tr>
          <td
            colspan="4"
            style="
              padding: 5px 50px 5px;
              color: #000;
              font-weight: 900;
              text-align: left;
              border-top: 1px solid #bebebe;
            "
          >
            热裤热
          </td>
        </tr>
        <tr>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">0</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">720</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">87228</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">87228</td>
        </tr>
        <tr>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">1</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">100</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">12222</td>
          <td style="padding: 5px 50px 5px; color: #000; text-align: center">100</td>
        </tr>
        <tr>
          <td
            style="
              padding: 5px 50px 5px;
              color: #000;
              border-bottom: 2px solid #000;
              text-align: center;
            "
          >
            Tota121l
          </td>
          <td
            style="
              padding: 5px 50px 5px;
              color: #000;
              border-bottom: 2px solid #000;
              text-align: center;
            "
          >
            82022
          </td>
          <td
            style="
              padding: 5px 50px 5px;
              color: #000;
              border-bottom: 2px solid #000;
              text-align: center;
            "
          >
            10022
          </td>
          <td
            style="
              padding: 5px 50px 5px;
              color: #000;
              border-bottom: 2px solid #000;
              text-align: center;
            "
          >
            10022
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
export default {
  data() {
    return {
      isShow: true
    }
  },
  methods: {
    copy() {
      let vm = this
      let clipboardInstance = new Clipboard('.btn', {
        target: function (trigger) {
          let domTable = trigger.nextElementSibling || document.getElementById('CTable')
          let cloneTable = domTable.cloneNode(true)
          let styleDoms = domTable.querySelectorAll('[style]')
          for (let i = 0; i < styleDoms.length; i++) {
            if (styleDoms[i].getAttribute('style').includes('padding')) {
              styleDoms[i].setAttribute(
                'style',
                styleDoms[i].getAttribute('style').replace(/padding.*px\;/g, '')
              )
            }
          }
          vm.isShow = false
          vm.$nextTick(() => {
            domTable = cloneTable.cloneNode(true)
            vm.isShow = true
          })
          return domTable
        }
      })

      clipboardInstance.on('success', e => {
        console.log('复制成功') //这里你如果引入了elementui的提示就可以用，没有就注释即可
        // 释放内存
        clipboardInstance.destroy()
      })
      clipboardInstance.on('error', e => {
        // 不支持复制
        console.log('该浏览器不支持自动复制')
        // 释放内存
        clipboardInstance.destroy()
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
