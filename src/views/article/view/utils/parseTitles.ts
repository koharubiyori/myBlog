import { Title } from "../Contents"

export default function parseTitles(articleRootElement: HTMLElement): Title[]{
  let titles = Array.from(articleRootElement.querySelectorAll('h1, h2, h3')).map((item, index) =>{
    let level = parseInt(item.tagName[1])
    let id = `articleTitle-${index}-${level}`
    let name = item.textContent!
    let offset = Math.floor(item.getBoundingClientRect().top)

    item.setAttribute('id', id)

    return { level, id, name, offset }
  })

  // 生成序号
  let lastLevel = 0,                 // 上个title的等级
      numbers: string[] = [],           // 生成序号的结果，长度和titles相同
      currentNumber: number[] = []   // 当前序号，根据这个来序列化每个序号的字符串
  titles.forEach(item =>{
    // 如果结果集为空(第一次循环)，则直接记录一个1
    if(numbers.length === 0){
      numbers.push('1')
      currentNumber.push(1)
      lastLevel = item.level
      return true
    }

    if(item.level > lastLevel){   // 当前等级大于最后等级(由大标题进入小标题)
      currentNumber.push(1)
    }else if(item.level === lastLevel){   // 进入同级标题
      // currentNumber的最后一个值+1
      let lastEndNumber = currentNumber[currentNumber.length - 1]
      currentNumber.splice(currentNumber.length - 1, 1, lastEndNumber + 1)
    }else{    // 由小标题进入大标题
      // 计算要退出几层（例如：三级标题下紧挨着一级标题，则：3 - 1）
      let upLevel = lastLevel - item.level
      // 利用splice返回删除元素的特性，将删除元素再赋给currentNumber，实现一个从尾部删除的效果
      currentNumber = currentNumber.splice(0, currentNumber.length - upLevel)

      let lastEndNumber = currentNumber[currentNumber.length - 1]
      currentNumber.splice(currentNumber.length - 1, 1, lastEndNumber + 1)
    }

    lastLevel = item.level
    numbers.push(currentNumber.join('.'))
  })

  return titles.map((item, index) => ({ ...item, number: numbers[index] }))
}