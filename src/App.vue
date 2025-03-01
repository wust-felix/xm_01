<template>
  <div id="root">
    <div class="todo-container">
      <div class="todo-wrap">
        <MyHeader @addTodo="addTodo" />
        <MyList :todos="todos" />
        <MyFooter
          :todos="todos"
          @checkAllTodo="checkAllTodo"
          @clearAllTodo="clearAllTodo"
        />
      </div>
    </div>
  </div>
</template>

<script>
import pubsub from 'pubsub-js';
import MyHeader from './components/MyHeader.vue';
import MyList from './components/MyList.vue';
import MyFooter from './components/MyFooter.vue';

export default {
  name: 'App',
  components: {
    MyHeader,
    MyList,
    MyFooter,
  },
  data() {
    return {
      todos: JSON.parse(localStorage.getItem('todos')) || [],
    };
  },
  watch: {
    todos: {
      // 初始化时让handler调用一下
      immediate: true,
      // 深度监视
      deep: true,
      handler(value) {
        localStorage.setItem('todos', JSON.stringify(value));
      },
    },
  },
  methods: {
    /* 自定义事件 */
    // 增（增加一个todo对象）
    addTodo(todoObj) {
      this.todos.unshift(todoObj);
    },
    // 改（修改所有todo对象的done属性）：全选 or 取消全选
    checkAllTodo(done) {
      this.todos.forEach((todo) => {
        todo.done = done;
      });
    },
    // 删（删除部分todo对象）：清除所有已经完成的todo
    clearAllTodo() {
      this.todos = this.todos.filter((todo) => todo.done == false);
    },

    /* 全局事件总线 */
    // 改（修改一个todo对象的title属性）：更新todo
    updateTodo(id, title) {
      this.todos.forEach((todo) => {
        if (todo.id === id) {
          todo.title = title;
        }
      });
    },
    // 改（修改一个todo对象的done属性）：勾选 or 取消勾选一个todo
    checkTodo(id, done) {
      this.todos.forEach((todo) => {
        if (todo.id === id) {
          todo.done = !done;
        }
      });
    },

    /* 消息订阅与发布 */
    // 删（删除一个todo对象）：删除一个待办事件
    deleteTodo(_, id) {
      this.todos = this.todos.filter((todo) => todo.id !== id);
    },
  },
  mounted() {
    // 全局事件总线：开启
    this.$bus.$on('checkTodo', this.checkTodo);
    this.$bus.$on('updateTodo', this.updateTodo);
    //this.$bus.$on('deleteTodo', this.deleteTodo)
    // 消息订阅与发布：开启
    this.pubId = pubsub.subscribe('deleteTodo', this.deleteTodo);
  },
  beforeDestroy() {
    // 全局事件总线：关闭
    this.$bus.$off('checkTodo', this.checkTodo);
    this.$bus.$off('updateTodo', this.updateTodo);
    //this.$bus.$off('deleteTodo', this.deleteTodo)
    // 消息订阅与发布：关闭
    pubsub.unsubscribe(this.pubId);
  },
};
</script>

<style>
/*base*/
body {
  background: #fff;
}

.btn {
  display: inline-block;
  padding: 4px 12px;
  margin-bottom: 0;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.btn-danger {
  color: #fff;
  background-color: #da4f49;
  border: 1px solid #bd362f;
}

.btn-danger:hover {
  color: #fff;
  background-color: #bd362f;
}

.btn-edit {
  color: #fff;
  background-color: skyblue;
  border: 1px solid rgb(103, 159, 180);
  margin-right: 5px;
}

.btn:focus {
  outline: none;
}

.todo-container {
  width: 600px;
  margin: 0 auto;
}
.todo-container .todo-wrap {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
