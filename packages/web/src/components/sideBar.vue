<script>
/**
 * SideBar Component
 * A navigation sidebar that allows users to switch between different views
 * Emits events when the selected item changes
 */

export default {
  name: 'SideBar',
  props: {
    openedTab: {
      type: Number,
      default: 0,
    },
    tabs: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // Currently selected sidebar item
      selectedItem: this.openedTab,
    }
  },
  // Watcher for selectedItem changes
  watch: {
    /**
     * Watches for changes in selectedItem and emits an event
     * @param {String} newVal - The new selected item value
     */
    selectedItem(newVal) {
      this.$emit('itemChanged', {
        selectedItem: newVal,
      })
    },
    openedTab(newVal){
      this.selectedItem = newVal
    }
  },
  methods: {
    scrollRight() {
      this.$refs.content.scrollLeft += this.$refs.content.clientWidth / 2

    },
    scrollLeft() {
      this.$refs.content.scrollLeft -= this.$refs.content.clientWidth / 2
    },
  },
}
</script>

<template>
  <!-- Main sidebar container -->
  <div class="side-bar-container">
    <!-- Navigation list -->
    <div class="scroll-arrow left-arrow" @click="scrollLeft">
      <i class="fa fa-caret-left"></i>
    </div>
    <Ul class="side-bar-content" ref="content">
      <li
        v-for="(tab, index) in tabs"
        :key="tab"
        @click="selectedItem = tabs.indexOf(tab)"
        :class="{ selected: selectedItem === index }"
        class="link"
      >
        {{ tab }}
      </li>
    </Ul>
    <div class="scroll-arrow right-arrow" @click="scrollRight" >
      <i class="fa fa-caret-right"></i>
    </div>
  </div>
</template>

<style scoped>
/* Main sidebar container styling */
.side-bar-container {
  width: 200px;
  background-color: var(--main-color);
  padding-top: 50px;
  direction: ltr;
}

/* Sidebar content list styling */
.side-bar-content {
  text-align: center;
  list-style: none;
  padding: 0;
  width: 100%;
}

/* List item styling */
.link {
  font-family: 'Montserrat Alternates', sans-serif;
  color: var(--background-color);
  font-size: 18px;
  font-weight: 500;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2 ease;
  text-transform: capitalize;
}

/* Border between items (except last child) */
.side-bar-content .link:not(:last-child) {
  border-bottom: 3px solid var(--background-color);
}

/* Hover effect for list items */
.link:hover {
  font-size: 20px;
}

/* Styling for currently selected item */
.link.selected {
  color: var(--controls-color);
}

.scroll-arrow {
  display: none;
}

/* Mobile responsive styles */
@media (max-width: 767px) {
  /* Adjust container for mobile */
  .side-bar-container {
    height: 40px;
    width: 100vw;
    box-sizing: border-box;
    padding: 0 10px;
    margin: 0;
    display: flex;
    align-items: flex-end;
  }

  /* Change layout to horizontal for mobile */
  .side-bar-content {
    display: flex;
    align-items: flex-end;
    height: 100%;
    margin: 0;
    overflow-x: scroll;
  }

  /* Adjust list items for mobile */
  .link {
    font-size: 10px;
    height: 25px;
    flex-basis: 50%;
    flex-shrink: 0;
    box-sizing: border-box;
    padding: 0 25px;
    transition: all 0.1s 0s linear;
    border-radius: 15px 15px 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Selected item styling for mobile */
  .link.selected {
    background-color: var(--background-color);
    color: var(--main-color);
  }

  /* Remove borders between items in mobile view */
  .side-bar-content .link:not(:last-child) {
    border-bottom: none;
  }

  /* Adjust hover effect for mobile */
  .link:hover {
    font-size: 12px;
  }

  .scroll-arrow {
    background-color: var(--main-color);
    color: var(--background-color);
    border-radius: 0;
    width: 20px;
    text-align: center;
    cursor: pointer;
    display: block;
    direction: ltr;
  }
}
</style>
