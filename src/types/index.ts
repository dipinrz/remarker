export interface Member {
  id: string;
  name: string;
  role: string;
  createdAt: Date;
}

export interface Remark {
  id: string;
  memberId: string;
  memberName: string;
  remark: string;
  date: Date;
  createdAt: Date;
}

export interface RemarkFilter {
  memberId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
}