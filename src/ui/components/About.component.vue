<template>
  <div class="about-component">
    <div class="logo-wrapper">
      <img class="logo" src="../../../img/icon.png" alt="Plugin logo" />
    </div>

    <h3 class="text-center" style="color: #000">Prototype Quick Link</h3>

    <p class="text-center">
      Copy the prototype link for a selected frame with a single click
    </p>

    <div class="text-center" style="padding-top: 18px">
      <h3>Credits</h3>

      <div style="display: inline-block; width: 50%; vertical-align: middle">
        The idea initiator
        <br />
        & artwork
        <br />
        <a href="https://www.protogeridis.com" target="_blank">
          Filippos Protogeridis
        </a>
      </div>

      <div style="display: inline-block; width: 50%; vertical-align: middle">
        Developer
        <br />
        <a href="https://maxmartynov.com/" target="_blank"> Max Martynov </a>
      </div>
    </div>

    <div class="text-center" style="padding-top: 18px">
      <h3>Support</h3>

      <div>
        Plugin creation fueled by coffee
        <br />
        <a
          href="https://github.com/maxmartynov/figma-plugin-copy-prototype-link#support"
          target="_blank"
        >
          Buy me a cuppa ☕
        </a>
      </div>
      <br />
      <div>
        Do you have an idea or found a bug?
        <br />
        <a :href="supportLink" target="_blank"> Let me know </a>
      </div>
    </div>

    <!-- <div class="text-center" style="padding-top: 32px">
      <div>
        <a :href="supportLink" target="_blank"> Do you have an idea? </a>
      </div>
    </div> -->

    <div class="footer">
      <div class="version">v{{ version }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {version, bugs} from '../../../package.json'

export default Vue.extend({
  name: 'AboutComponent',
  data() {
    return {
      version: version,
      supportLink: bugs.url,
    }
  },
})
</script>

<style>
.about-component {
  text-align: left;
  display: inline-block;
  padding: 12px 16px;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.about-component .logo-wrapper {
  text-align: center;
}
.about-component .logo-wrapper .logo {
  display: inline-block;
  width: 60px;
  height: 60px;
  margin: 15px 0;
}

.about-component .footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: var(--footer-height);
  z-index: 7;
  text-align: right;
  pointer-events: none;
}
.about-component .footer .version {
  display: inline-block;
  padding: 0 5px;
  font-weight: 500;
  font-size: 10px;
  line-height: var(--footer-height);
  pointer-events: all;
}
</style>
