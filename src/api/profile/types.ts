
export const ProfileStatusEnum = {
	PENDING: 'pending',
	REJECTED: 'rejected',
	ACTIVE: 'active',
	BANNED: 'banned', // исправил опечатку 'banded' → 'banned'
} as const;

export type ProfileStatusEnum = typeof ProfileStatusEnum[keyof typeof ProfileStatusEnum];

export type PartnerResponse = {
	id: string;
	name: string;
	phone: string;
	email: string;
	descriptionOfActivities: string;
	status: ProfileStatusEnum;
}

export type PartnersPaginationResponse = {
	records: PartnerResponse[];
	totalPages: number;
}