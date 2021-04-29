<template>
  <div class="comp-root">

    <h1 class="app-name white--text text-h2 mb-8 font-weight-medium">
      Mi<span>Workouts</span>
    </h1>

    <div class="loader-container">
      <div class="loader">
        <div v-for="i in 26" :key="`dot-${i}`" class="dot"></div>
      </div>
    </div>

  </div>  
</template>

<script>
  export default {
    name: 'Loader',
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/global.scss";

  .comp-root {
    background: #000;
    width: 100%;
    height: 100vh;
    z-index: 3;
    position: absolute;
    overflow: hidden;
  }

  .app-name {
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translateY(-25%) translateX(-50%);

    span { color: #1976d2; }
  }

  .loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  $dot-count: 26;
  $dot-size: 10px;
  $dot-space: 15px;
  $dot-start: (($dot-count / 2 + 1) * ($dot-size + $dot-space)) / 2;

  $animation-time: 2s;
  $animation-distance: 25px;

  .loader {
    position: relative;

    .dot {
      animation-name: movement;
      animation-duration: $animation-time;
      animation-iteration-count: infinite; 
      animation-timing-function: ease-in-out;
      height: $dot-size;
      position: absolute;
      top: -#{$dot-size};
      transform: translate3d(0, -#{$animation-distance}, 0) scale(1);
      width: $dot-size;
  
      @for $i from 1 through $dot-count {
        $dot-move: ceil($i / 2);
        $dot-pos: $dot-start - (($dot-size + $dot-space) * $dot-move);
        
        $animation-delay: -#{$i * .1}s;
        @if $i % 2 == 0 {
          $animation-delay: -#{($i * .1) + ($animation-time / 2)};
        }
        
        &:nth-of-type(#{$i}) {
          animation-delay: $animation-delay; 
          left: $dot-pos;
          
          &::before {
            animation-delay: $animation-delay; 
          }
        }
      }

      &::before {
        animation-name: size-opacity;
        animation-duration: $animation-time;
        animation-iteration-count: infinite; 
        animation-timing-function: ease;
        background: #fff;
        border-radius: 50%;
        content: '';
        display: block;
        height: 100%;
        width: 100%;
      }
      
      &:nth-of-type(even)::before {
        background-color: #1976d2;
        box-shadow: inset 0 0 4px darken(#1976d2, 10%);
      }
    }
  }

  @keyframes movement {
    0% {
      transform: translate3d(0, -#{$animation-distance}, 0);
      z-index: 0;
    }
    50% {
      transform: translate3d(0, #{$animation-distance}, 0);
      z-index: 10;
    }
    100% {
      transform: translate3d(0, -#{$animation-distance}, 0);
      z-index: -5;
    }
  }

  @keyframes size-opacity {
    0% { 
      opacity: 1;
      transform: scale(1);
    }
    25% {
      transform: scale(1.5);
    }
    50% {
      opacity: 1;
    }
    75% {
      opacity: .35;
      transform: scale(.5);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>