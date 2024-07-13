import { GeneratePodcastProps } from '@/types'
import React, { useState } from 'react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid';
import { useUploadFiles } from '@xixixao/uploadstuff/react';
import { useToast } from "@/components/ui/use-toast"


const useGeneratePodcast = ({
    setAudio, voiceType, voicePrompt, setAudioStorageId
}: GeneratePodcastProps) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast()
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const { startUpload } = useUploadFiles(generateUploadUrl) 

    const getPodcastAudio = useAction(api.openai.generateAudioAction)

    const getAudioUrl = useMutation(api.podcast.getUrl);

    const generatePodcast = async () => {
        setIsGenerating(true);
        setAudio('');

        if(!voicePrompt) {
            toast({
                title: "Please provide a voiceType to generate a podcast",
              })
            return setIsGenerating(false);
        }

        try {
            const response = await getPodcastAudio({
                voice: voiceType,
                input: voicePrompt
            })

            const blob = new Blob([response], { type: 'audio/mpeg' });
            const fileName = `podcast-${uuidv4()}.mp3`;
            const file = new File([blob], fileName, { type: 'audio/mpeg' });

            const uploaded = await startUpload([file]);
            const storageId = (uploaded[0].response as any).storageId;

            setAudioStorageId(storageId);

            const audioUrl = await getAudioUrl({ storageId });
            setAudio(audioUrl!);
            setIsGenerating(false);
            toast({
                title: "Congratulation! Your podcast generated successfully",
              })
        } catch (error) {
            console.log('Error generating podcast', error)
            toast({
                title: "Error! please try again",
                variant: 'destructive',
              })
            setIsGenerating(false);
        }
    }

    return { isGenerating, generatePodcast}
}

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast} = useGeneratePodcast(props);

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
            value={props.voicePrompt}
            onChange={(e) => props.setVoicePrompt(e.target.value)}
            />
        </div>
        <div className="mt-5 w-full max-w-[200px]">
        <Button type="submit" 
            className="text-16 bg-blue-500 
            py-4 font-bold text-white-1 transition-all duration-500 hover:bg-black-1"onClick={generatePodcast}>
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
        {props.audio && (
            <audio
            controls
            src={props.audio}
            autoPlay
            className="mt-5"
            onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
            />
        )}
    </div>
  )
}

export default GeneratePodcast
