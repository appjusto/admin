import { UserProfile } from '@appjusto/types';

export type UpdateProfile = ({}) => void;

export interface Result {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export interface PersonalProfileProps {
  profile: UserProfile;
  updateProfile: UpdateProfile;
  result: Result;
}
