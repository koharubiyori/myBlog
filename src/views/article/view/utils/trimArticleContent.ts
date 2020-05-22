import qs from 'qs'
import createRouter from '~/utils/createRouter'

export default function trimArticleContent(articleRootElement: HTMLElement): void{
  const router = createRouter()
  
  articleRootElement.querySelectorAll('a').forEach(aTag =>{
    aTag.addEventListener('click', e => {
      // 判断是否为外链，如果是则直接跳出，如果为内链，则分别解析path和params，之后传给路由器
      if(/^https?:\/\//.test(aTag.getAttribute('href')!)) { return }
      e.preventDefault()
      const [path, params] = aTag.getAttribute('href')!.split('?')
      router.push(path as any, { search: qs.parse(params) })
    })
  })
}