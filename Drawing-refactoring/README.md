# fabric.js 라이브러리 수정 방법



### 1. fabric/src/brushes에 브러쉬 파일추가

- `fabric-brush/src/brushes`에 있는 `crayon_brush.js`등 모든 브러쉬 파일을 **`fabric-brush/src/brushes`로 이동**
- **파일명을 `crayon_brush.class.js`로 변경**
- **다른 모든 브러쉬** 파일도 위와 같이 변경
- 단, 기존에 존재하는 `spray_brush_class.js`는 지우고, 새로운 파일로 대체



### 2. fabric/src에 extend 파일 추가

- `fabric-brush/src/util`에 있는 `point.extend.js`와 `	util.extend.js`를 **`fabric/src`로 이동**



### 3. build.js 파일 수정

```js
// 149번째 라인부분을 해당 부분으로 대채
'src/point.class.js',
'src/intersection.class.js',
'src/color.class.js',
'src/point.extend.js',
'src/util.extend.js',

// 165번째 라인에 추가
ifSpecifiedInclude('freedrawing', 'src/brushes/base_brush.class.js'),
ifSpecifiedInclude('freedrawing', 'src/brushes/circle_brush.class.js'),
ifSpecifiedInclude('freedrawing', 'src/brushes/crayon_brush.class.js'),
ifSpecifiedInclude('freedrawing', 'src/brushes/drip.class.js'),
ifSpecifiedInclude('freedrawing', 'src/brushes/ink_brush.class.js'),
ifSpecifiedInclude('freedrawing', 'src/brushes/marker_brush.class.js'),
ifSpecifiedInclude('freedrawing', 'src/brushes/pattern_brush.class.js'),
ifSpecifiedInclude('freedrawing', 'src/brushes/pencil_brush.class.js'),
ifSpecifiedInclude('freedrawing', 'src/brushes/spray_brush.class.js'),
ifSpecifiedInclude('freedrawing', 'src/brushes/stroke.class.js'),
```



### 4. build 다시하기

```bash
# 라이브러리 빌드 다시하기
$ cd node_modules/fabric
$ npm install
$ npm run build

# 리액트 실행
$ cd ../..
$ npm start
```