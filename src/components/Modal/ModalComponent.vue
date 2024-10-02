<script setup>
import { modalData } from '@/Stores/Modal'

function closeModal() {
  modalData.isVisible = false
}
</script>

<template>
  <div
    class="modal-main"
    :class="modalData.isGood ? 'modal-successfull' : 'modal-error'"
    v-if="modalData.isVisible"
  >
    <div class="modal-message">
      {{ modalData.message }}
    </div>
    <div class="modal-button" @click="closeModal">
      <button>
        <img src="/Close.svg" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.modal-main {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 50px;
  align-items: center;
}
.modal-message {
  padding-left: 30px;
}
.modal-button img {
  height: 25px;
  width: 25px;
}
.modal-button img:hover {
  cursor: pointer;
}
.modal-button button {
  background-color: transparent;
  border: none;
}
.modal-successfull {
  background-color: #216bcc;
}
.modal-error {
  background-color: #e02930;
}
</style>
