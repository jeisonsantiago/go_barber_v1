interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defauts: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defauts:{
    from:{
      email: '4elements@jeisonsantiago.com',
      name: 'Jeison from 4Elements',
    }
  }
} as IMailConfig;
