import { type FC } from 'react';
import {
    StyledEpisodeCard,
    StyledEpisodeTitle,
    StyledEpisodeDescription,
    StyledAudioPlayer,
} from './EpisodeCard.styles';

interface EpisodeCardProps {
    title: string;
    description: string;
    episodeUrl: string;
}

export const EpisodeCard: FC<EpisodeCardProps> = ({ title, description, episodeUrl }) => {
    return (
        <StyledEpisodeCard>
            <StyledEpisodeTitle>{title}</StyledEpisodeTitle>
            <StyledEpisodeDescription>{description}</StyledEpisodeDescription>
            <StyledAudioPlayer controls>
                <source src={episodeUrl} type='audio/mpeg' />
                <source src={episodeUrl} type='audio/ogg' />
                <source src={episodeUrl} type='audio/wav' />
                Your browser does not support the audio element.
            </StyledAudioPlayer>
        </StyledEpisodeCard>
    );
};
