import React, { PropsWithChildren, useState, KeyboardEvent, ChangeEvent, useRef } from 'react'
import store from '~/redux'
import { InputBase, Box, makeStyles } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { CSSTransition } from 'react-transition-group'
import ClearIcon from '@material-ui/icons/Clear'
import { flex, transition } from '~/styles'
import styleVars from '~/styles/styleVars'
import TagIcon from '~/components/icons/tag'

export interface Props {
  tags: string[]
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSelectHint: (name: string) => void
  onRemoveTag: (index: number) => void
}

type FinalProps = Props

function TagInput(props: PropsWithChildren<FinalProps>){
  const 
    classes = useStyles(),
    [tagInputFocused, setTagInputFocused] = useState(false),  
    [selectedHint, setSelectedHint] = useState(-1),      // -1代表选中的为输入栏
    refs = {
      input: useRef()
    },
    {tags: tagList} = store.getState().data,
    filteredTags = (tagList || []).filter(item => !props.tags.includes(item.name)).filter(item => item.name.indexOf(props.value) >= 0)

  function _onKeyDown (e: KeyboardEvent<HTMLInputElement>){
    // 用于在选择提示时，不受按上下方向键光标变动的影响
    function setInputLocation (location: number){
      setTimeout(() =>{
        let input: any = refs.input.current
        input.selectionStart = input.selectionEnd = location
      })
    }
    
    if(e.keyCode === 38){
      setSelectedHint(prevVal =>{
        if(prevVal === -1){
          setInputLocation(props.value.length)
          return filteredTags.length
        }else{
          let newVal = prevVal - 1
          setInputLocation(props.value.length)
          return newVal
        }
      })
    }

    if(e.keyCode === 40){
      setSelectedHint(prevVal =>{
        if(prevVal === filteredTags.length){
          setInputLocation(props.value.length)
          return -1
        }else{
          let newVal = prevVal + 1
          setInputLocation(props.value.length)
          return newVal
        }
      })
    }

    if(e.keyCode === 13){
      if(props.value === ''){ return }
      let selectedTag = filteredTags[selectedHint] ? filteredTags[selectedHint].name : props.value
      if(props.tags.includes(selectedTag)) return $notify('标签已存在') 
      props.onSelectHint(selectedTag) 
    }

    if(props.value === '' && e.keyCode === 8){
      if(props.tags.length !== 0) props.onRemoveTag(props.tags.length - 1)
    }
  }
  
  return (
    <label>
      <div tabIndex={1} className={c(flex.row, flex.wrap, flex.crossCenter, classes.tagInput)} data-focused={tagInputFocused}
        onFocus={() => setTagInputFocused(true)}
        onBlur={() => setTagInputFocused(false)}
      >
        {props.tags.map((item: any, index) => 
          <div className={classes.tag} key={index}>
            <span style={{ position: 'relative', top: -1 }}>{typeof item === 'string' ? item : item.name}</span>
            <ClearIcon style={{ position: 'relative', left: 3, cursor: 'pointer' }} onClick={() => props.onRemoveTag(index)} />
          </div>
        )}
        <InputBase 
          className={flex.grow}
          style={{ marginLeft: 5 }}
          value={props.value}
          onChange={props.onChange} 
          onKeyDown={_onKeyDown}
          placeholder="回车添加标签"
          inputRef={refs.input}
        />

        <CSSTransition unmountOnExit in={!!props.value} timeout={200} classNames={transition.fade}>
          <Box boxShadow={3} className={classes.hintsMenu}>
            {filteredTags.map((item, index) =>
              <p key={index} tabIndex={1} data-selected={index === selectedHint} onClick={() => props.onSelectHint(item.name)}>
                <TagIcon style={{ width: 18, height: 18, margin: '0 4px' }} />
                <span>{item.name}</span>
              </p>
            )}

            {(tagList || []).map(item => item.name).includes(props.value) === false ?
              <p tabIndex={1} data-selected={filteredTags.length === selectedHint} onClick={() => props.onSelectHint(props.value)}>
                <AddIcon />
                <span>{props.value}</span>
              </p>
            : null}
          </Box>
        </CSSTransition>
      </div>
    </label>
  )
}

export default TagInput

const useStyles = makeStyles({
  tagInput: {
    padding: 10,
    outline: 'none',
    position: 'relative',
  
    '@global > input': {
      border: 'none',
      outline: 'none',
      boxSizing: 'border-box',
    },
  
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      boxSizing: 'border-box',
      border: '1px #C4C4C4 solid',
      borderRadius: 3,
      transition: 'all 0.2s',
      zIndex: -1,
    },
  
    '&:hover': {
      '&::before': {
        borderColor: 'black',
      }
    },
  
    '&[data-focused=true]': {
      '&::before': {
        borderWidth: 2,
        borderColor: `${styleVars.main} !important`,
      }
    }
  },
  
  tag: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px 10px',
    backgroundColor: styleVars.main,
    color: 'white',
    fontSize: 13,
    border: '1px #ccc solid',
    borderRadius: 5,
    margin: '2.5px 5px',
  },
  
  hintsMenu: {
    width: '100%',
    maxHeight: 300,
    overflow: 'auto',
    position: 'absolute',
    left: 0,
    top: '100%',
    backgroundColor: 'white',
    zIndex: 1,
    cursor: 'pointer',
  
    '@global > p': {
      margin: 0,
      height: 36,
      padding: '5px 10px',
      boxSizing: 'border-box',
      display: 'flex',
      width: '100%',
      alignItems: 'center',
  
      '&:not(:first-child)': {
        borderTop: '1px #eee solid',
      },
  
      [`&[data-selected=true],
        &:hover
      `]: {
        backgroundColor: '#eee'
      }
    }
  }
})