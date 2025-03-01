<template>
  <li>
    <label>
      <input
        type="checkbox"
        :checked="todo.done"
        @change="handleCheck(todo.id, todo.done)"
      />
      <span v-show="!todo.isEdit">{{ todo.title }}</span>
      <input
        type="text"
        v-show="todo.isEdit"
        :value="todo.title"
        @blur="handleBlur(todo, $event)"
        ref="inputTitle"
      />
    </label>
    <button class="btn btn-danger" @click="handleDelete(todo.id)">删除</button>
    <button
      v-show="!todo.isEdit"
      class="btn btn-edit"
      @click="handleEdit(todo)"
    >
      编辑
    </button>
  </li>
</template>

<script>
import pubsub from 'pubsub-js';

export default {
  name: 'MyItem',
  // 声明接收todo对象
  props: ['todo'],
  methods: {
    // 勾选或取消勾选
    handleCheck(id, done) {
      // 通知App组件将对应的todo对象done值取反
      // this.checkTodo(id)
      this.$bus.$emit('checkTodo', id, done);
    },
    // 删除
    handleDelete(id) {
      if (confirm('确定删除吗？')) {
        // 通知App组件将对应的todo对象删除
        // this.deleteTodo(id)
        // 全局总线事件写法：this.$bus.$emit('deleteTodo', id)
        pubsub.publish('deleteTodo', id);
      }
    },
    // 编辑
    handleEdit(todo) {
      todo.isEdit = true;
      this.$nextTick(() => {
        this.$refs.inputTitle.focus();
      });
    },
    // 失去焦点回调，真正实现修改逻辑
    handleBlur(todo, e) {
      todo.isEdit = false;
      if (e.target.value.trim() == '') {
        return alert('输入不能为空！');
      }
      this.$bus.$emit('updateTodo', todo.id, e.target.value);
    },
  },
};
</script>

<style>
/*item*/
li {
  list-style: none;
  height: 36px;
  line-height: 36px;
  padding: 0 5px;
  border-bottom: 1px solid #ddd;
}

li label {
  float: left;
  cursor: pointer;
}

li label li input {
  vertical-align: middle;
  margin-right: 6px;
  position: relative;
  top: -1px;
}

li button {
  float: right;
  display: none;
  margin-top: 3px;
}

li:before {
  content: initial;
}

li:last-child {
  border-bottom: none;
}

/* 鼠标悬浮改变背景色 */
li:hover {
  background-color: #ddd;
}

/* 鼠标悬浮显现删除按钮 */
li:hover button {
  display: block;
}
</style>
