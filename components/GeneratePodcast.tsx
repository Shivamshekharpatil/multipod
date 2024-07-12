import { GeneratePodcastProps } from '@/types'
import React, { useState } from 'react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'

const GeneratePodcast = ({
    setAudioStorageId,
    setAudio,
    voiceType,
    audio,
    voicePrompt,
    setVoicePrompt,
    setAudioDuration,
}: GeneratePodcastProps) => {
    const [isGenerating, setIsGenerating] = useState(false)

  return (
    <div>
        <div className="flex flex-col gap-2.5">
            <Label className="text-16 font-bold text-white-1">
                Write an AI prompt to Generate Podcast.
            </Label>
            <Textarea
            className="input-class font-light focus-visible:ring-offset-blue-500"
            placeholder='Provide Text to generate audio'
            rows={5}
            value={voicePrompt}
            onChange={(e) => setVoicePrompt(e.target.value)}
            />
        </div>
        <div className="mt-5 w-full max-w-[200px]">
        <Button type="submit" 
            className="text-16 bg-blue-500 
            py-4 font-bold text-white-1 transition-all duration-500 hover:bg-black-1">
              {isGenerating ? (
                <>
                
                Generating
                <Loader size={20} className="animate-spin ml-2" />
                </>
              ) : (
                'Generate'
              )}
            </Button>
        </div>
        {audio && (
            <audio
            controls
            src={audio}
            autoPlay
            className="mt-5"
            onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration)}
            />
        )}
    </div>
  )
}

export default GeneratePodcast
