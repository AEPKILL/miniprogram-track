# WechatRenderOpCode

微信 Render 函数的操作指令

## 操作指令

- `_` 添加子节点

```text
   _(r, oD)， 等同于:

   <r>
    <oD />
   <r/>
```

- `_af` import 一个组件

  ```text

  _ai(xC, ...others) others 不用处理,xC 就是 src

  <import src="{{xC}}" />

  ```

- `_v` 创建一个 Virtual 节点

  ```text
  <block></block>
  ```

- `_oz` 执行一条指令

```text

  _oz(z, opindex, env, scope, global)

  z 是缓存好指令集
  opindex 是指令集的索引
  env 是环境变量
  scope 是 data 对象
  global 是 globalData 对象


  这个比较复杂，要根据 z 数组里面的指令来还原

```

- `_n` 创建一个节点

```text
_n('view')

<view />
```

## 帮助函数

- `grb`
