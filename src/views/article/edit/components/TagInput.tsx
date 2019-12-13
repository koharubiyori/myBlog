import React, { PropsWithChildren, useState, KeyboardEvent, ChangeEvent, useRef } from 'react'
import classes from './TagInput.module.scss'
import store from '~/redux'
import { InputBase, Box } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import TagSvg from '~/images/sub/tag.svg'
import { CSSTransition } from 'react-transition-group'
import ClearIcon from '@material-ui/icons/Clear'

const TagIcon = (props: any) => <embed src={TagSvg} {...props} />

export interface Props {
  tags: string[]
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSelectHint: (name: string) => void
  onRemoveTag: (index: number) => void
}

type FinalProps = Props

function TagInput({
  children,
  tags,
  value,
  onChange,
  onSelectHint,
  onRemoveTag
}: PropsWithChildren<FinalProps>){
  const [tagInputFocused, setTagInputFocused] = useState(false)  
  const [selectedHint, setSelectedHint] = useState(-1)      // -1代表选中的为输入栏
  const {tags: tagList} = store.getState().data
  const filteredTags = (tagList || []).filter(item => !tags.includes(item.name)).filter(item => item.name.indexOf(value) >= 0)
  const inputRef = useRef()

  function _onKeyDown (e: KeyboardEvent<HTMLInputElement>){
    // 用于在选择提示时，不受按上下方向键光标变动的影响
    function setInputLocation (location: number){
      setTimeout(() =>{
        let input: any = inputRef.current
        input.selectionStart = input.selectionEnd = location
      })
    }
    
    if(e.keyCode === 38){
      setSelectedHint(prevVal =>{
        if(prevVal === -1){
          // onSelectHint(value)
          setInputLocation(value.length)
          return filteredTags.length
        }else{
          let newVal = prevVal - 1
          // onSelectHint(newVal === -1 ? value : filteredTags[newVal].name)
          setInputLocation(value.length)
          return newVal
        }
      })
    }

    if(e.keyCode === 40){
      setSelectedHint(prevVal =>{
        if(prevVal === filteredTags.length){
          // onSelectHint(value)
          setInputLocation(value.length)
          return -1
        }else{
          let newVal = prevVal + 1
          // onSelectHint(filteredTags.length === 0 ? value : filteredTags[newVal].name)
          setInputLocation(value.length)
          return newVal
        }
      })
    }

    if(e.keyCode === 13){
      if(value === ''){ return }
      let selectedTag = filteredTags[selectedHint] ? filteredTags[selectedHint].name : value
      if(tags.includes(selectedTag)) return $notify('标签已存在') 
      onSelectHint(selectedTag) 
    }

    if(value === '' && e.keyCode === 8){
      if(tags.length !== 0) onRemoveTag(tags.length - 1)
    }
  }
  
  return (
    <label>
      <div tabIndex={1} {...c('flex-row flex-wrap flex-cross-center', classes.tagInput)} data-focused={tagInputFocused}
        onFocus={() => setTagInputFocused(true)}
        onBlur={() => setTagInputFocused(false)}
      >
        {tags.map((item: any, index) => 
          <div {...c(classes.tag)} key={index}>
            <span style={{ position: 'relative', top: -1 }}>{typeof item === 'string' ? item : item.name}</span>
            <ClearIcon style={{ position: 'relative', left: 3, cursor: 'pointer' }} onClick={() => onRemoveTag(index)} />
          </div>
        )}
        <InputBase {...c('flex-grow')}
          style={{ marginLeft: 5 }}
          value={value}
          onChange={onChange} 
          onKeyDown={_onKeyDown}
          placeholder="回车添加标签"
          inputRef={inputRef}
        />

        <CSSTransition unmountOnExit in={!!value} timeout={200} classNames="fade">
          <Box boxShadow={3} className={classes.hintsMenu}>
            {filteredTags.map((item, index) =>
              <p tabIndex={1} data-selected={index === selectedHint}>
                <TagIcon style={{ width: 18, height: 18, margin: '0 4px' }} />
                <span>{item.name}</span>
              </p>
            )}

            {(tagList || []).map(item => item.name).includes(value) === false ?
              <p tabIndex={1} data-selected={filteredTags.length === selectedHint}>
                <AddIcon />
                <span>{value}</span>
              </p>
            : null}
          </Box>
        </CSSTransition>
      </div>
    </label>
  )
}

export default TagInput