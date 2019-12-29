export default function trimArticleContent(articleRootElement: HTMLElement): void{
  articleRootElement.querySelectorAll('a').forEach(aTag =>{
    if(/^https?:\/\//.test(aTag.href)) aTag.setAttribute('target', '_blank')
  })
}